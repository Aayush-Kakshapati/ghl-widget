import { create } from "zustand";

const defaultSettings = {
  type: "announcement",
  layout: "list",
  items_num: 6,

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
