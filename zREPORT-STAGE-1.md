# GHL Announcement Widget Builder

## Stage 1 – Learning Production Architecture

---

# Project Goal

Build a **production-style GoHighLevel (GHL) Announcement Banner Widget Builder** using:

* React
* Vite
* Zustand
* JavaScript

The purpose of this project is **not just to build a banner**, but to learn the architecture used by real-world widget builders that can eventually be integrated into the GoHighLevel Marketplace.

---

# Current Architecture

```text
ghl-announcement-widget/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   │
│   │   ├── SettingsPanel.jsx
│   │   ├── Preview.jsx
│   │   ├── ColorPicker.jsx
│   │   │
│   │   └── widgets/
│   │       └── AnnouncementBanner.jsx
│   │
│   ├── store/
│   │   └── widgetStore.js
│   │
│   ├── widget/
│   │   ├── createHtml.js
│   │   ├── createCss.js
│   │   ├── createJs.js
│   │   └── generateWidget.js
│   │
│   ├── communication/
│   │   └── ghlCommunication.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── ...
```

---

# Overall Architecture

The application is divided into four major layers.

```text
User

    │

    ▼

React Components

    │

    ▼

Zustand Store

    │

    ├───────────────┐

    ▼               ▼

Preview         Widget Generator

                    │

                    ▼

           HTML / CSS / JS

                    │

                    ▼

          GHL Communication Layer
```

Each layer has a single responsibility.

---

# Folder Responsibilities

---

## components/

Contains the React UI.

These files are responsible only for rendering the builder interface.

They should **never** contain:

* HTML generation
* CSS generation
* JavaScript generation
* GHL communication
* localStorage logic

---

### SettingsPanel.jsx

**Responsibility**

Provides all configuration controls for the widget.

Examples:

* Announcement message
* Button text
* Button URL
* Colors
* Show/Hide button

It updates the Zustand store.

Flow:

```text
User

↓

Input

↓

updateSetting()

↓

Zustand Store
```

---

### Preview.jsx

**Responsibility**

Displays the live widget preview.

It does **not** generate HTML strings.

It simply reads data from the Zustand store and renders the React widget.

Flow:

```text
Zustand

↓

Preview

↓

AnnouncementBanner
```

---

### ColorPicker.jsx

(Currently placeholder)

Later this will become a reusable color picker component.

Instead of repeating:

```jsx
<input type="color" />
```

multiple times, we can reuse this component.

---

### components/widgets/

Contains React implementations of widgets.

These components are only used inside the builder preview.

Future example:

```text
widgets/

AnnouncementBanner.jsx

PricingTable.jsx

Popup.jsx

Countdown.jsx
```

---

### AnnouncementBanner.jsx

Represents the React version of the widget.

Responsibilities:

* Display announcement message
* Display button
* Apply styles from settings
* Render live preview

It should never generate HTML strings.

---

# store/

Contains application state.

Current file:

```text
widgetStore.js
```

Uses Zustand.

This replaces the old vanilla JavaScript object:

```javascript
const settings = {}
```

The store becomes the application's **Single Source of Truth**.

Example:

```javascript
settings = {

message,

buttonText,
https://www.example.com/
buttonUrl,

colors,

showButton

}
```

Everything reads from the store.

Everything writes to the store.

---

## widgetStore.js

Responsibilities:

Stores widget settings.

Provides actions:

* updateSetting()
* updateColor()
* resetSettings()
* getSettings()

Later this will closely resemble the GoHighLevel `elementStore`.

---

# widget/

Contains the Widget Generation Engine.

Important:

This folder should have **no React code**.

Its purpose is to generate the widget that will eventually be sent to GoHighLevel.

---

### createHtml.js

Responsibility:

Generate HTML string.

Input:

```javascript
settings
```

Output:

```html
<div class="announcement">
...
</div>
```

---

### createCss.js

Responsibility:

Generate CSS string.

Uses colors and style settings.

Output:

```css
.announcement{

background:#111;

}
```

---

### createJs.js

Responsibility:

Generate widget JavaScript.

Initially:

```javascript
console.log("Widget Loaded")
```

Later:

* click tracking
* animations
* countdown timers
* API requests
* analytics

---

### generateWidget.js

Acts as the orchestrator.

Combines:

* createHtml()
* createCss()
* createJs()

Returns:

```javascript
{

html,

css,

js,

elementStore

}
```

This object is the widget payload.

---

# communication/

Contains communication with external platforms.

Current file:

```text
ghlCommunication.js
```

Right now:

```javascript
sendToGHL(widget)
```

will simply:

```javascript
console.log(widget)
```

Later it will use:

* iframe
* Postmate
* GoHighLevel SDK
* API communication

Keeping this logic isolated means we can replace the implementation without changing the rest of the application.

---

# App.jsx

Application composition.

Responsible for arranging the builder UI.

Example:

```text
SettingsPanel

↓

Preview
```

App.jsx should not contain business logic.

---

# main.jsx

React entry point.

Responsibilities:

* Create React root
* Render App

Nothing more.

---

# Current Data Flow

```text
User

↓

SettingsPanel

↓

updateSetting()

↓

Zustand Store

↓

React detects state change

↓

Preview

↓

AnnouncementBanner
```

---

# Widget Generation Flow

(Not yet fully connected)

```text
Zustand Store

↓

generateWidget()

↓

createHtml()

↓

createCss()

↓

createJs()

↓

Widget Payload
```

Output:

```javascript
{

html,

css,

js,

elementStore

}
```

---

# Future Communication Flow

```text
Widget Payload

↓

sendToGHL()

↓

Postmate / iframe

↓

GoHighLevel Builder
```

---

# Design Principles

This project follows several important architectural principles.

## 1. Single Responsibility

Every file should have one clear purpose.

Examples:

* SettingsPanel edits data.
* Preview displays data.
* widgetStore stores data.
* createHtml generates HTML.
* ghlCommunication sends data.

---

## 2. Single Source of Truth

The Zustand store owns the widget state.

No component should maintain its own copy of the widget configuration.

---

## 3. Separation of Concerns

React components do not generate HTML strings.

Widget generators do not know React exists.

Communication layer does not know how HTML is created.

Each layer has one responsibility.

---

## 4. Scalable Architecture

This structure prepares the project for future additions such as:

* Multiple widget types
* GoHighLevel Marketplace integration
* Postmate communication
* localStorage persistence
* Widget templates
* Theme system
* Versioning
* Analytics

without requiring major architectural changes.

---

# Current Progress

Completed:

* ✅ React + Vite project setup
* ✅ Zustand state management
* ✅ Settings panel
* ✅ Live preview
* ✅ React widget component
* ✅ Widget generation layer structure
* ✅ Production folder organization

Upcoming:

* LocalStorage persistence
* GHL communication layer
* Widget payload generation
* Simulated elementStore
* Postmate preparation
* Production-ready architecture (Stage 2)
