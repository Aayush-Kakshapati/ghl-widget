import { useWidgetStore } from "../store/widgetStore";
import { widgetRegistry } from "./widgets/registry";

function SettingsPanel() {
  const settings = useWidgetStore((state) => state.settings);

  const updateSetting = useWidgetStore((state) => state.updateSetting);

  const layouts = widgetRegistry.announcement.layouts;

  const isCarouselLayout = settings.layout === "carousel";
  const isGridLayout = settings.layout === "grid";

  return (
    <div>
      <h2 className="panel-header">Widget Settings</h2>

      <div className="field">
        <label className="field-label">Title</label>
        <input
          type="text"
          defaultValue={settings.title}
          onChange={(e) => updateSetting("title", e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label">Description</label>
        <input
          type="text"
          defaultValue={settings.description}
          onChange={(e) => updateSetting("description", e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label">Display Layout</label>
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

      {/* Item box size, applies to grid and carousel */}
      {(isGridLayout || isCarouselLayout) && (
        <div className="field-row">
          <div className="field">
            <label className="field-label">Item Width (px)</label>
            <input
              type="number"
              min="40"
              value={settings.item_width}
              onChange={(e) => updateSetting("item_width", Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label className="field-label">Item Height (px)</label>
            <input
              type="number"
              min="40"
              value={settings.item_height}
              onChange={(e) => updateSetting("item_height", Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Grid: number of columns */}
      {isGridLayout && (
        <div className="field">
          <label className="field-label">Grid Columns</label>
          <input
            type="number"
            min="0"
            value={settings.grid_columns}
            onChange={(e) => updateSetting("grid_columns", Number(e.target.value))}
          />
          <div className="field-hint">0 = auto-fit based on item width</div>
        </div>
      )}

      {/* Carousel: how many items fit across the content width */}
      {isCarouselLayout && (
        <div className="field">
          <label className="field-label">Items Per View</label>
          <input
            type="number"
            min="1"
            value={settings.carousel_items_per_view}
            onChange={(e) =>
              updateSetting("carousel_items_per_view", Number(e.target.value))
            }
          />
        </div>
      )}

      {isCarouselLayout && (
        <>
          <div className="field">
            <label className="field-label">Animation Style</label>
            <select
              value={settings.carousel_animation}
              onChange={(e) => updateSetting("carousel_animation", e.target.value)}
            >
              <option value="none">None</option>
              <option value="loop">Smooth Loop (continuous scroll)</option>
              <option value="batch">Batch Slide (takes over in a beat)</option>
            </select>
          </div>

          {settings.carousel_animation !== "none" && (
            <div className="field">
              <label className="field-label">Animation Speed</label>
              <div className="field-row">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.carousel_speed}
                  onChange={(e) =>
                    updateSetting("carousel_speed", Number(e.target.value))
                  }
                />
                <span className="field-value">{settings.carousel_speed}</span>
              </div>
              <div className="field-hint">
                {settings.carousel_speed <= 3
                  ? "Slow"
                  : settings.carousel_speed <= 7
                  ? "Medium"
                  : "Fast"}
              </div>
            </div>
          )}
        </>
      )}

      <div className="field">
        <label className="field-label">No. of Items</label>
        <input
          type="number"
          min="1"
          value={settings.items_num}
          onChange={(e) => updateSetting("items_num", Number(e.target.value))}
        />
      </div>

      <div className="field-group">
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.set_preview_visible}
            onChange={(e) =>
              updateSetting("set_preview_visible", e.target.checked)
            }
          />
          <span className="slider"></span>
          <span>Display Preview</span>
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.set_ghlpreview_visible}
            onChange={(e) =>
              updateSetting("set_ghlpreview_visible", e.target.checked)
            }
          />
          <span className="slider"></span>
          <span>Display GHL Preview</span>
        </label>
      </div>
    </div>
  );
}

export default SettingsPanel;
