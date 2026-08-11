import SplitLayout from "./layouts/SplitLayout";
import CenteredLayout from "./layouts/CenteredLayout";

function AnnouncementBanner({ settings }) {
  switch (settings.layout) {
    case "centered":
      return <CenteredLayout settings={settings} />;

    case "split":
    default:
      return <SplitLayout settings={settings} />;
  }
}

export default AnnouncementBanner;