import { useWidgetStore } from "../store/widgetStore";
import { widgetRegistry } from "./widgets/registry";
import { useWidgetData } from "../hooks/useWidgetData";

function SettingsPanel() {
  const settings = useWidgetStore((state) => state.settings);

  const updateSetting = useWidgetStore((state) => state.updateSetting);

  const updateColor = useWidgetStore((state) => state.updateColor);

  const setApiData = useWidgetStore((state) => state.setApiData);

  const layouts = widgetRegistry.announcement.layouts;

  const { loading, error, fetchData } = useWidgetData();

  const handleTestApi = async () => {
    console.log("FETCHING:", settings.api.url);

    const result = await fetchData(settings.api.url);

    console.log("RESULT FROM API:", result);

    if (result) {
      console.log("SETTING API DATA:", result);

      setApiData(result);
    }
  };
  return (
    <div>
      <h2>Widget Settings</h2>

      <label>Widget Layout</label>

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

      <label>Announcement Message</label>

      <input
        value={settings.message}
        onChange={(e) => updateSetting("message", e.target.value)}
      />

      <label>Button Text</label>

      <input
        value={settings.buttonText}
        onChange={(e) => updateSetting("buttonText", e.target.value)}
      />

      <label>Button URL</label>

      <input
        value={settings.buttonUrl}
        onChange={(e) => updateSetting("buttonUrl", e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={settings.showButton}
          onChange={(e) => updateSetting("showButton", e.target.checked)}
        />
        Show Button
      </label>

      <hr />

      <h3>Colors</h3>

      <label>Background Color</label>

      <input
        type="color"
        value={settings.colors.background}
        onChange={(e) => updateColor("background", e.target.value)}
      />

      <label>Text Color</label>

      <input
        type="color"
        value={settings.colors.text}
        onChange={(e) => updateColor("text", e.target.value)}
      />

      <label>Button Color</label>

      <input
        type="color"
        value={settings.colors.button}
        onChange={(e) => updateColor("button", e.target.value)}
      />

      <hr />

      <h3>Dynamic API Data</h3>

      <label>
        <input
          type="checkbox"
          checked={settings.api.enabled}
          onChange={(e) =>
            updateSetting("api", {
              ...settings.api,
              enabled: e.target.checked,
            })
          }
        />
        Enable API Data
      </label>

      <label>API URL</label>

      <input
        type="url"
        value={settings.api.url}
        placeholder="/api/offer.json"
        onChange={(e) =>
          updateSetting("api", {
            ...settings.api,
            url: e.target.value,
          })
        }
      />

      <button
        type="button"
        disabled={!settings.api.url || loading}
        onClick={handleTestApi}
      >
        {loading ? "Testing..." : "Test API"}
      </button>

      {error && <p>API Error: {error}</p>}
    </div>
  );
}

export default SettingsPanel;
