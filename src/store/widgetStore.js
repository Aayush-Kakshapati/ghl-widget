import { create } from "zustand";

// This store holds *configuration only* - type, layout, api url, colors,
// etc. It's exactly what gets sent to GHL as elementStore. Fetched data
// (users/products/whatever) is never stored here; it lives transiently in
// whichever component called useWidgetData, and is re-fetched from `api.url`
// whenever the widget mounts. This keeps elementStore small and means the
// data is always fresh rather than a stale snapshot.
const defaultSettings = {
  type: "announcement",
  layout: "list",

  api: {
    url: "https://dummyjson.com/users",
  },
};

export const useWidgetStore = create((set, get) => ({
  settings: defaultSettings,

  // True once the user has made any edit in SettingsPanel. GHL's Postmate
  // handshake resolves asynchronously and can arrive after the user has
  // already started editing (it's a single message, not guaranteed to beat
  // user interaction). Once the user has touched settings, incoming GHL
  // elementStore updates should no longer silently overwrite their choices.
  hasUserEdited: false,

  updateSetting: (key, value) => {
    set((state) => ({
      hasUserEdited: true,
      settings: {
        ...state.settings,
        [key]: value,
      },
    }));
  },

  // Called only by the GHL hydration path (App.jsx), never by the user.
  // Ignored once the user has made a local edit, so a late-resolving
  // handshake can't clobber a choice the user already made.
  setSettingsFromGHL: (settings) => {
    if (get().hasUserEdited) return;

    set({ settings });
  },

  // Explicit user-driven replace (e.g. loading a saved preset). Distinct
  // from setSettingsFromGHL: this genuinely represents the user's intent,
  // so it should also arm hasUserEdited.
  setSettings: (settings) => {
    set({ settings, hasUserEdited: true });
  },

  resetSettings: () => {
    set({ settings: defaultSettings, hasUserEdited: false });
  },

  getSettings: () => get().settings,
}));
