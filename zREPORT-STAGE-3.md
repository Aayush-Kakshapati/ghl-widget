# zREPORT-STAGE-3: Widget Architecture & File Reference

This document explains how the widget builder works end to end, and what
every file and function in `src/` is responsible for.

---

## 1. What this app does

This is a GHL (HighLevel) embedded widget builder. It runs inside an iframe
hosted by GHL, lets a user configure a widget (currently one type:
"Announcement Banner") by picking a layout and a data source, previews it
live, and streams the compiled HTML/CSS/JS back to GHL for publishing.

Two renderers exist for the same configuration:

- **React preview** (`components/`, `hooks/`, `store/`) — what the user
  sees while editing, inside this app.
- **Vanilla JS runtime** (`widget/createJs.js`) — a self-contained script
  with no build step or imports, generated as a string and shipped to GHL to
  run inside the *published* widget, on someone else's page.

Both renderers fetch the same API URL and transform the response into the
same generic shape before rendering. That shared shape is the core idea the
whole architecture is built around.

---

## 2. The core idea: normalized collection data

Whatever the data source is — DummyJSON users today, products or
announcements later — every layout in this app only ever renders items
shaped like this:

```js
{
  id: 1,
  title: "Emily Johnson",
  subtitle: "emily.johnson@x.dummyjson.com",
  image: "https://dummyjson.com/icon/emilys/128", // optional, can be null
}
```

Nothing below the normalization step (layouts, `WidgetItemCard`, the
runtime renderer) knows or cares where that data came from. Adding a new
data source later means writing one new normalizer function — no layout
component ever changes.

---

## 3. End-to-end data flow (React preview)

```
                    GHL parent frame
                          │
                 (Postmate handshake)
                          ▼
              ghlCommunication.js
                          │
                          ▼
                      App.jsx
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
       SettingsPanel.jsx         Preview.jsx
              │                       │
              ▼                       ▼
        widgetStore.js  ◄──────  (reads settings)
              │
              │ settings.api.url, settings.layout
              ▼
      AnnouncementBanner.jsx
              │
              ▼
       useWidgetData.js  ──────►  apiService.js  ──────►  fetch(url)
              │                        │
              │                 (raw API response)
              │                        │
              │                 normalize*(raw)
              │                        │
              │◄───────────────────────┘
              │  { items: [{id,title,subtitle,image}] }
              ▼
      widgetRegistry (registry.js)
              │
       resolves settings.layout → layout component
              ▼
   ListLayout / GridLayout / SmallCarouselLayout /
   CarouselLayout / FullCarouselLayout
              │
              ▼
      WidgetItemCard.jsx (× N items)
```

**Config flows down** from `widgetStore` (layout choice, API URL). **Data
flows sideways** — fetched independently by `useWidgetData` inside
`AnnouncementBanner`, never stored in `widgetStore`. This is deliberate:
`widgetStore.settings` is exactly what gets serialized and sent to GHL as
`elementStore`, and fetched data should never end up baked into that
payload — it should always be fetched fresh.

---

## 4. End-to-end data flow (published embed)

```
        App.jsx → generateWidget.js
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  createHtml.js    createCss.js    createJs.js
        │               │               │
        └───────────────┴───────────────┘
                        │
                sendToGHL (ghlCommunication.js)
                        │
                        ▼
              GHL parent frame receives
              { html, js, elementStore }
                        │
           (published on an end-user's page)
                        │
                        ▼
        createJs.js's generated script runs:
        fetch(api.url) → normalize (inlined copy
        of the same logic as apiService.js) →
        render items into #ghl-widget by layout
```

The published embed has no bundler, so `createJs.js` cannot `import`
anything — it generates a plain `<script>` string with the fetch/normalize/
render logic duplicated inline. Conceptually it mirrors
`apiService.js` + the layout components; if a new normalizer is added to
`apiService.js`, the matching logic must also be added inside
`createJs.js`'s generated string.

---

## 5. File-by-file reference

### `main.jsx`
Vite/React entry point. Mounts `<App />` into `#root`, imports global CSS
(`index.css`, `App.css`). No logic of its own.

### `App.jsx`
Top-level component. Two responsibilities:

1. **Hydrate from GHL on load.** Calls `initializeGHL(callback)` once on
   mount. When GHL's Postmate handshake resolves with a saved
   `elementStore`, the callback fires `setSettingsFromGHL(elementStore)`.
2. **Push changes back to GHL.** Whenever `settings` changes, it calls
   `generateWidget(settings)` to compile the current config into
   `{ html, js, elementStore }`, then `sendToGHL(widget)` to stream it to
   the parent frame.

Renders `<SettingsPanel />` and `<Preview />` side by side.

**Why `setSettingsFromGHL` and not `setSettings`:** GHL's handshake is
async and can resolve *after* the user has already changed a setting in
`SettingsPanel`. `setSettingsFromGHL` is a no-op once the user has made any
local edit (see `widgetStore.js` → `hasUserEdited`), so a late-arriving
handshake can't silently overwrite a choice the user already made. This
was a real bug (layout reverting right after being selected) that this
guard fixes.

### `communication/ghlCommunication.js`
Wraps [Postmate](https://github.com/dollarshaveclub/postmate) for
iframe↔parent messaging with GHL.

- `initializeGHL(onElementStore)` — waits for the handshake, then calls
  `onElementStore` with whatever `elementStore` GHL's parent model has
  stored, if any.
- `sendToGHL(widget)` — waits for the handshake, then emits a `"code"`
  event to the parent with `{ html, js, elementStore }`.

Knows nothing about widget internals — it only relays whatever it's given.

### `store/widgetStore.js`
Zustand store. Holds **configuration only** — never fetched data.

```js
{
  type: "announcement",
  layout: "list",
  api: { url: "https://dummyjson.com/users" },
}
```

This object is exactly what gets sent to GHL as `elementStore`. Fetched
items are intentionally never stored here — see §3 above.

State/actions:
- `settings` — current config.
- `hasUserEdited` — becomes `true` the first time `updateSetting` is
  called. Used to block stale GHL hydration from overwriting live user
  input (see `App.jsx` above).
- `updateSetting(key, value)` — used by `SettingsPanel` when the user
  changes a control (e.g. layout dropdown). Sets `hasUserEdited = true`.
- `setSettingsFromGHL(settings)` — used only by `App.jsx`'s GHL hydration
  path. Ignored if `hasUserEdited` is already `true`.
- `setSettings(settings)` — explicit full replace representing genuine user
  intent (e.g. loading a preset). Also sets `hasUserEdited = true`.
- `resetSettings()` — restores `defaultSettings` and clears
  `hasUserEdited`.
- `getSettings()` — non-reactive getter, for use outside React render
  (e.g. inside `App.jsx`'s effects if needed without subscribing).

### `components/SettingsPanel.jsx`
The editing UI. Currently a single control: a `<select>` for
`settings.layout`, populated from `widgetRegistry.announcement.layouts` so
the dropdown options always match what layouts actually exist. On change,
calls `updateSetting("layout", value)`.

### `components/Preview.jsx`
Live preview panel. Reads `settings` from `widgetStore` and, based on
`settings.type`, mounts the matching widget-type component (currently only
`AnnouncementBanner`). Does **not** read or shape API data itself — that
was a bug in the previous version (`Preview.jsx` used to reach directly
into `apiData.users[0].firstName`), fixed by routing entirely through
`AnnouncementBanner`.

### `components/widgets/registry.js`
The single source of truth for "what layouts exist for what widget type,
and which component renders each one."

```js
{
  announcement: {
    name: "Announcement Banner",
    layouts: {
      list:             { name: "List",             component: ListLayout },
      grid:             { name: "Grid",              component: GridLayout },
      "small-carousel": { name: "Small Carousel",    component: SmallCarouselLayout },
      carousel:         { name: "Normal Carousel",   component: CarouselLayout },
      "full-carousel":  { name: "Full Carousel",     component: FullCarouselLayout },
    },
  },
}
```

Two consumers read this:
- `SettingsPanel` reads the `name`s to build the layout dropdown.
- `AnnouncementBanner` reads `component` to know what to mount for the
  currently selected layout.

Adding a new widget type (e.g. `price`) means adding a new top-level key
here with its own `layouts` map — nothing else in the registry changes.

### `components/widgets/announcement/AnnouncementBanner.jsx`
The widget-type-level renderer for "announcement". Its only jobs:

1. Call `useWidgetData(settings.api?.url)` to get normalized `items`,
   `loading`, and `error`.
2. Look up `widgetRegistry.announcement.layouts[settings.layout]` to find
   the layout component to render.
3. Render a loading state, an error state, or delegate to the layout
   component with `items`.

It never fetches raw data itself and never touches DummyJSON-shaped (or
any other source-shaped) fields directly — that translation already
happened in `apiService.js`.

### `components/widgets/announcement/layouts/*.jsx`
Five pure, presentational layout components. Each takes `{ items }` (an
array of normalized `{ id, title, subtitle, image }` objects) and renders
them inside a differently-styled container. They contain **no fetching,
no normalization, no registry logic** — only markup/CSS-class differences.

| File | Renders |
|---|---|
| `ListLayout.jsx` | One item per row (`.ghl-widget-list`, flex column) |
| `GridLayout.jsx` | Cards in a 3-column grid (`.ghl-widget-grid`) |
| `SmallCarouselLayout.jsx` | Small horizontal-scroll cards (`.layout-small-carousel`, min-width 180px) |
| `CarouselLayout.jsx` | Larger horizontal-scroll cards (`.layout-carousel`, min-width 280px) |
| `FullCarouselLayout.jsx` | One full-width card at a time (`.layout-full-carousel`, min-width 100%) |

Each maps directly to a CSS class already defined in `widget/createCss.js`.

### `components/widgets/announcement/layouts/WidgetItemCard.jsx`
The single shared building block every layout uses to render one item. This
is the **only** component in the entire layout tree that reads
`item.title`, `item.subtitle`, or `item.image`. If the normalized shape
ever changes, this is the only file that needs to change — every layout
just wraps however many of these it needs in its own container.

### `hooks/useWidgetData.js`
Generic data-fetching hook. Given a URL, returns
`{ items, loading, error }`. Knows nothing about "users" or any other
source — it only calls `fetchWidgetData(url)` from `apiService.js` and
exposes the result as React state.

Behavior notes:
- Re-fetches only when `url` changes (verified: switching `layout` in
  `SettingsPanel` does **not** trigger a refetch, since the effect's
  dependency array is `[url]`).
- `loading` initializes to `Boolean(url)`, not `false` — this avoids a
  one-render flash where `loading` is falsely `false` and `items` is
  empty, before the fetch effect has had a chance to run.
- Guards against setting state after unmount/URL-change via a `cancelled`
  flag inside the effect.

### `services/apiService.js`
The only place raw API responses are read. Two jobs:

1. `fetchWidgetData(url)` — performs the `fetch`, throws on non-OK
   responses, parses JSON, and picks the right normalizer for the URL.
2. A small table of **normalizers** (`normalizeDummyUsers`,
   `normalizeGeneric`) that convert a source's raw shape into
   `{ items: [{ id, title, subtitle, image }] }`.

`normalizeDummyUsers(raw)` — knows DummyJSON's `/users` shape
(`{ users: [{ id, firstName, lastName, email, image }] }`) and maps it to
the generic item shape (`title` = full name, `subtitle` = email).

`normalizeGeneric(raw)` — fallback for any URL without a dedicated
normalizer. Tries common field names (`title`/`name`,
`subtitle`/`description`, `image`/`thumbnail`) so an unrecognized source
degrades gracefully instead of breaking.

**To add a new data source:** write one new `normalizeX(raw)` function and
add one entry to the `NORMALIZERS` array with a `test(url)` matcher. No
other file needs to change.

### `services/storageService.js`
Currently fully commented out. Previously provided `localStorage`-backed
`saveWidget`/`loadWidget`/`clearWidget`, used during local development
before the app was wired to GHL's `elementStore` persistence. Left in
place (commented) as a historical note rather than deleted outright, in
case local-only development mode is needed again.

### `widget/generateWidget.js`
Compiles the current `settings` into the payload that gets sent to GHL:

```js
{
  html: `<style>${createCss()}</style>\n${createHtml(settings)}`,
  js: createJs(settings),
  elementStore: settings,
}
```

Called from `App.jsx` whenever `settings` changes, immediately followed by
`sendToGHL(widget)`.

### `widget/createHtml.js`
Returns the minimal HTML shell for the embed: a single container div,
`<div id="ghl-widget" class="ghl-widget layout-{layout}"></div>`. All
actual content is injected at runtime by `createJs.js`'s generated script.

### `widget/createCss.js`
Returns the CSS (as a string) for all five layouts — `.ghl-widget-list`,
`.ghl-widget-grid`, `.layout-small-carousel`, `.layout-carousel`,
`.layout-full-carousel` — plus the shared `.ghl-widget-item` card style.
This CSS is shared by both the React preview (via the same class names in
the layout `.jsx` files) and the published embed.

### `widget/createJs.js`
Generates the vanilla-JS `<script>` that runs inside the **published**
widget on an end-user's page (no React, no bundler, no imports available
there). It's a template string containing:

- An inlined copy of the same normalizers from `apiService.js`
  (`normalizeDummyUsers`, `normalizeGeneric`), selected by URL.
- A `renderItem(item)` function mirroring `WidgetItemCard.jsx`, built with
  raw DOM calls (`createElement`, `appendChild`) instead of JSX.
- A `layoutClassName(layout)` function mirroring the registry's layout
  keys, mapped to the same CSS classes from `createCss.js`.
- A `render(items)` function that sets the root element's class and
  appends one card per item.
- Top-level logic that reads `settings.api.url` (baked in at generation
  time via `JSON.stringify(settings)`), fetches it, normalizes the
  response, and renders it — with a fallback error message if the fetch
  fails.

This file must be kept in sync with `apiService.js` and the layout
components by hand, since it can't literally import them (it ships as a
standalone string, not a module).

---

## 6. Known coupling points to watch when extending this

- **Two renderers, one contract.** `apiService.js`'s normalizers and
  `createJs.js`'s inlined normalizers implement the same logic twice. A new
  data source needs a normalizer added in *both* places, or the published
  embed will silently fall back to `normalizeGeneric` instead of using the
  correct mapping.
- **Registry is the contract for layouts.** Any new layout needs: (1) a
  component in `layouts/`, (2) a CSS class in `createCss.js`, (3) an entry
  in `registry.js`, and (4) a matching `case` in `createJs.js`'s
  `layoutClassName`. Missing any one of these means the React preview and
  the published embed can disagree on how a layout looks.
- **`widgetStore.settings` is a public contract with GHL.** Its shape is
  serialized directly as `elementStore`. Adding new config fields (e.g. for
  a future `price` widget type) needs to consider what GHL will store and
  send back on reload.
