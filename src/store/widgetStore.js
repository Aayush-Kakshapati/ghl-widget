import { create } from "zustand";

const defaultSettings = {
  type: "announcement",
  title: "",
  description: "",
  layout: "list",
  items_num: 3,
  set_ghlpreview_visible: false,
  set_preview_visible: false,

  carousel_animation: "none", // "none" | "loop" | "batch"
  carousel_speed: 5, // 1 (slow) - 10 (fast)

  api: {
    url: "https://dummyjson.com/users",
  },
};

export const useWidgetStore = create((set, get) => ({
  settings: defaultSettings,

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

  setSettingsFromGHL: (settings) => {
    if (get().hasUserEdited) return;

    set({ settings });
  },

  setSettings: (settings) => {
    set({ settings, hasUserEdited: true });
  },

  resetSettings: () => {
    set({ settings: defaultSettings, hasUserEdited: false });
  },

  getSettings: () => get().settings,
}));
