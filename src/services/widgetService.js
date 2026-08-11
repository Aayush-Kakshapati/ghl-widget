import { create } from "zustand";
import { loadWidget } from "../services/storageService";

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
  apiData: null,
};

const initialSettings = loadWidget() || defaultSettings;

export const useWidgetStore = create((set, get) => ({
  settings: initialSettings,

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
    set((state) => ({
      settings: {
        ...state.settings,
        apiData: data,
      },
    }));
  },

  resetSettings: () => {
    set({
      settings: defaultSettings,
    });
  },

  getSettings: () => {
    return get().settings;
  },
}));
