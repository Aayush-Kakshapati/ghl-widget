import { useWidgetStore } from "../store/widgetStore";
import { widgetRegistry } from "./widgets/registry";

function SettingsPanel() {
  const settings = useWidgetStore((state) => state.settings);

  const updateSetting = useWidgetStore((state) => state.updateSetting);

  const layouts = widgetRegistry.announcement.layouts;

  return (
    <div>
      <h2>Widget Settings</h2>

      <label>Display Layout</label>

      <select
        value={settings.layout}
        onChange={(e) => updateSetting("layout", e.target.value)}
      >
        {Object.entries(layouts).map(([layoutId, layout]) => (
          <option key={layoutId} value={layoutId}>
            {layout.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SettingsPanel;
