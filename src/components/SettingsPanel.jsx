import { useWidgetStore } from "../store/widgetStore";
import { widgetRegistry } from "./widgets/registry";

function SettingsPanel() {
  const settings = useWidgetStore((state) => state.settings);

  const updateSetting = useWidgetStore((state) => state.updateSetting);

  const layouts = widgetRegistry.announcement.layouts;

  const isCarouselLayout = ["small-carousel", "carousel", "full-carousel"].includes(
    settings.layout
  );

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

      {isCarouselLayout && (
        <>
          <label>Animation Style: </label>
          <select
            value={settings.carousel_animation}
            onChange={(e) => updateSetting("carousel_animation", e.target.value)}
          >
            <option value="none">None</option>
            <option value="loop">Smooth Loop (continuous scroll)</option>
            <option value="batch">Batch Slide (takes over in a beat)</option>
          </select>

          <hr />

          {settings.carousel_animation !== "none" && (
            <>
              <label>Animation Speed: </label>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.carousel_speed}
                onChange={(e) =>
                  updateSetting("carousel_speed", Number(e.target.value))
                }
              />
              <span style={{ marginLeft: 8 }}>{settings.carousel_speed}</span>

              <hr />
            </>
          )}
        </>
      )}

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
