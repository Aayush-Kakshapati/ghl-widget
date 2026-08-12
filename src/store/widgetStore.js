import { create } from "zustand";

const defaultSettings = {
  type: "announcement",

  layout: "split",

  message: "Limited Time Offer!",

  buttonText: "Learn More",

  buttonUrl: "https://example.com",

  colors: {
    background: "#256aff",
    text: "#fff651",
    button: "#28e30f",
  },

  showButton: true,

  api: {
    enabled: false,
    url: "",
  },
};

const initialSettings = defaultSettings;

export const useWidgetStore = create((set, get) => ({
  settings: initialSettings,

  apiData: null,

  updateSetting: (key, value) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value,
      },
    }));
  },

  updateColor: (key, value) => {
    set((state) => ({
      settings: {
        ...state.settings,

        colors: {
          ...state.settings.colors,
          [key]: value,
        },
      },
    }));
  },

  setSettings: (settings) => {
    set({
      settings,
    });
  },

  setApiData: (data) => {
    set({
      apiData: data,
    });
  },

  clearApiData: () => {
    set({
      apiData: null,
    });
  },

  resetSettings: () => {
    set({
      settings: defaultSettings,
      apiData: null,
    });
  },

  getSettings: () => {
    return get().settings;
  },
}));
