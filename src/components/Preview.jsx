import { useWidgetStore } from "../store/widgetStore";
import AnnouncementBanner from "./widgets/announcement/AnnouncementBanner";
import FloatingWidget from "./widgets/floating-widget/FloatingWidget";

function Preview() {
  const settings = useWidgetStore((state) => state.settings);

  return (
    <div className="preview-panel">
      <h2>Preview</h2>

      <div className="preview-surface">
        {settings.title ? <h3 className="preview-heading">{settings.title}</h3> : null}
        {settings.description ? (
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

        {settings.type === "announcement" && <AnnouncementBanner settings={settings} />}
        <FloatingWidget settings={settings} />
      </div>
    </div>
  );
}

export default Preview;
