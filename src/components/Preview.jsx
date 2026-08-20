import { useWidgetStore } from "../store/widgetStore";
import AnnouncementBanner from "./widgets/announcement/AnnouncementBanner";

function Preview() {
  const settings = useWidgetStore((state) => state.settings);
  const isFloatingLayout = settings.layout === "floating";

  return (
    <div className="preview-panel">
      <h2>Preview</h2>

      <div className="preview-surface">
        {!isFloatingLayout && settings.title ? (
          <h3 className="preview-heading">{settings.title}</h3>
        ) : null}
        {!isFloatingLayout && settings.description ? (
          <p className="preview-description">{settings.description}</p>
        ) : null}

        <div className="preview-meta">
          <span className="preview-meta-item">
            Layout: <strong>{settings.layout}</strong>
          </span>
          <span className="preview-meta-item">
            Visible items: <strong>{settings.items_num}</strong>
          </span>
        </div>

        {settings.type === "announcement" && (
          <AnnouncementBanner settings={settings} />
        )}
      </div>
    </div>
  );
}

export default Preview;
