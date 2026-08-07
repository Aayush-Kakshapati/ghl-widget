import { useEffect } from "react";

import SettingsPanel from "./components/SettingsPanel";
import Preview from "./components/Preview";

import { useWidgetStore } from "./store/widgetStore";
import { publishWidget } from "./services/widgetService"
import { saveWidget } from "./services/storageService";

function App() {

  const settings = useWidgetStore((state) => state.settings)

  useEffect(() => {
    publishWidget(settings)
    saveWidget(settings)
  }, [settings])

  return (

    <div
      style={{
        display: "flex",
        gap: "40px",
        padding: "40px"
      }}
    >
      <SettingsPanel />
      <Preview />
    </div>
  );
}

export default App;