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

  if (!settings) {
    return null;
  }

  return (
    <>
      <div className="app-layout">
        <div className="settings-column">
          <SettingsPanel />
        </div>

        {settings.set_preview_visible && (
          <div className="preview-column">
            <Preview />
          </div>
        )}
      </div>

      {settings.set_ghlpreview_visible && (
        <div className="preview-column">
          <GHLPreview  widget={widget}/>
        </div>
      )}
    </>
  );
}

export default App;
