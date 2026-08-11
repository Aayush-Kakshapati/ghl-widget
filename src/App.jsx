import { useEffect } from "react";

import SettingsPanel from "./components/SettingsPanel";
import Preview from "./components/Preview";

import { useWidgetStore } from "./store/widgetStore";

import { initializeGHL, sendToGHL } from "./communication/ghlCommunication";

import { generateWidget } from "./widget/generateWidget";

import { saveWidget } from "./services/storageService";

function App() {
  const settings = useWidgetStore((state) => state.settings);

  const setSettings = useWidgetStore((state) => state.setSettings);

  useEffect(() => {
    initializeGHL((elementStore) => {
      setSettings(elementStore);
    });
  }, [setSettings]);

  useEffect(() => {
    const widget = generateWidget(settings);

    sendToGHL(widget);

    saveWidget(settings);
  }, [settings]);

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        padding: "40px",
      }}
    >
      <SettingsPanel />

      <Preview />
    </div>
  );
}

export default App;
