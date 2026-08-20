import { create } from "zustand";

const defaultSettings = {
  type: "announcement",
  title: "",
  description: "",
  layout: "list",
  items_num: 3,
  set_ghlpreview_visible: false,
  set_preview_visible: false,
  item_width: 220,
  item_height: 220,
  carousel_items_per_view: 3,
  carousel_animation: "none",
  carousel_speed: 5,
  grid_columns: 3,
  floating_enabled: false,
  floating_position: "bottom-right",
  floating_panel_side: "right",
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
