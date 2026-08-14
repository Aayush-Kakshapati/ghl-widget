import { useWidgetStore } from "../store/widgetStore";
import AnnouncementBanner from "./widgets/announcement/AnnouncementBanner";

function Preview() {
  const settings = useWidgetStore((state) => state.settings);

  return (
    <div>
      <h2>Preview</h2>

      {settings.title ? <p>{settings.title}</p> : null}
      {settings.description ? <p>{settings.description}</p> : null}

      <p>Layout: {settings.layout}</p>

      <p>No of visible Items: {settings.items_num} </p>

      {settings.type === "announcement" && (
        <AnnouncementBanner settings={settings} />
      )}
    </div>
  );
}

export default Preview;
