import { useWidgetStore } from "../store/widgetStore";
import AnnouncementBanner from "./widgets/announcement/AnnouncementBanner";

function Preview() {
  const settings = useWidgetStore((state) => state.settings);

  const apiData = useWidgetStore((state) => state.apiData);

  console.log("PREVIEW API DATA:", apiData);

  const previewSettings = {
    ...settings,
    ...(apiData || {}),
  };

  return (
    <div>
      <h2>Preview</h2>

      <AnnouncementBanner settings={previewSettings} />
    </div>
  );
}

export default Preview;
