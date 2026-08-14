import { useEffect } from "react";

import SettingsPanel from "./components/SettingsPanel";
import Preview from "./components/Preview";

import { useWidgetStore } from "./store/widgetStore";

import { initializeGHL, sendToGHL } from "./communication/ghlCommunication";

import { generateWidget } from "./widget/generateWidget";

import GHLPreview from "./components/GHLPreview";

function App() {
  const settings = useWidgetStore((state) => state.settings);
  const widget = settings ? generateWidget(settings) : null;

  const setSettingsFromGHL = useWidgetStore(
    (state) => state.setSettingsFromGHL,
  );

  useEffect(() => {
    initializeGHL((elementStore) => {
      setSettingsFromGHL(elementStore);
    });
  }, [setSettingsFromGHL]);

  useEffect(() => {
    if (!settings) return;

    sendToGHL(widget);
  }, [settings, widget]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "40px",
          padding: "40px",
        }}
      >
        <SettingsPanel />

        {settings.set_preview_visible && <Preview />}
      </div>
      <div>{settings.set_ghlpreview_visible && <GHLPreview widget={widget} />}</div>
    </div>
  );
}

export default App;
