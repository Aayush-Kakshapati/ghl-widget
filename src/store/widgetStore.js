import { create } from "zustand";

const defaultSettings = {
  type: "announcement",
  title: "",
  description: "",
  layout: "list",
  items_num: 3,
  set_ghlpreview_visible: false,
  set_preview_visible: false,

  // Item box size, used by grid and carousel layouts
  item_width: 220, // px
  item_height: 220, // px, "auto" also allowed

  // Carousel: how many item boxes fit across the content width at once
  // (0 = full width, one item per view, ignores item_width cap)
  carousel_items_per_view: 3,
  carousel_animation: "none", // "none" | "loop" | "batch"
  carousel_speed: 5, // 1 (slow) - 10 (fast)

  // Grid: number of columns (0/"" = auto-fit based on item_width)
  grid_columns: 3,

  // Floating: trigger corner and which side the sliding panel opens from
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
