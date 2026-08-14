import { useWidgetStore } from "../store/widgetStore";
import { widgetRegistry } from "./widgets/registry";

function SettingsPanel() {
  const settings = useWidgetStore((state) => state.settings);

  const updateSetting = useWidgetStore((state) => state.updateSetting);

  const layouts = widgetRegistry.announcement.layouts;

  return (
    <div>
      <h2>Widget Settings</h2>

      <label>Title: </label>
      <input
        type="text"
        defaultValue={settings.title}
        onChange={(e) => updateSetting("title", e.target.value)}
      />

      <hr />

      <label>Description: </label>
      <input
        type="text"
        defaultValue={settings.description}
        onChange={(e) => updateSetting("description", e.target.value)}
      />

      <hr />

      <label>Display Layout: </label>

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

      <hr />

      <label>No. of Items: </label>
      <input
        type="number"
        min="1"
        value={settings.items_num}
        onChange={(e) => updateSetting("items_num", Number(e.target.value))}
      />

      <hr />

      <label className="toggle">
        <input
          type="checkbox"
          checked={settings.set_preview_visible}
          onChange={(e) =>
            updateSetting("set_preview_visible", e.target.checked)
          }
        />
        <span className="slider"></span>
        <span>Display Preview</span>{" "}
      </label>

      <hr />

      <label className="toggle">
        <input
          type="checkbox"
          checked={settings.set_ghlpreview_visible}
          onChange={(e) =>
            updateSetting("set_ghlpreview_visible", e.target.checked)
          }
        />
        <span className="slider"></span>
        <span>Display GHL Preview</span>{" "}
      </label>
    </div>
  );
}

export default SettingsPanel;
