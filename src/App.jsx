import { useEffect } from "react";

import SettingsPanel from "./components/SettingsPanel";
import Preview from "./components/Preview";

import { useWidgetStore } from "./store/widgetStore";

import { initializeGHL, sendToGHL } from "./communication/ghlCommunication";

import { generateWidget } from "./widget/generateWidget";

function App() {
  const settings = useWidgetStore((state) => state.settings);

  const setSettingsFromGHL = useWidgetStore((state) => state.setSettingsFromGHL);

  // initializeGHL's Postmate handshake can resolve at any time relative to
  // user interaction - including *after* the user has already changed a
  // setting in SettingsPanel. setSettingsFromGHL is a no-op once the user
  // has made a local edit, so a late-resolving handshake can no longer
  // silently overwrite a choice the user already made (e.g. layout
  // snapping back to whatever GHL had stored).
  useEffect(() => {
    initializeGHL((elementStore) => {
      setSettingsFromGHL(elementStore);
    });
  }, [setSettingsFromGHL]);

  useEffect(() => {
    if (!settings) return;

    const widget = generateWidget(settings);

    sendToGHL(widget);
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
