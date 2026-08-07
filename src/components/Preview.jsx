import { useWidgetStore } from "../store/widgetStore";
import AnnouncementBanner from "./widgets/AnnouncementBanner";

function Preview() {

    const settings = useWidgetStore(
        (state) => state.settings
    );

    return (
        <div>
            <h2>
                Preview
            </h2>
            <AnnouncementBanner settings={settings} />
        </div>
    );
}

export default Preview;