import { useWidgetData } from "../../../hooks/useWidgetData";
import { widgetRegistry } from "../registry";

function AnnouncementBanner({ settings }) {
  const { items, loading, error } = useWidgetData(settings.api?.url);

  const layoutConfig = widgetRegistry.announcement.layouts[settings.layout];
  const LayoutComponent = layoutConfig?.component;

  if (loading) {
    return <div className="ghl-widget-status">Loading…</div>;
  }

  if (error) {
    return <div className="ghl-widget-status">Couldn't load data: {error}</div>;
  }

  if (!LayoutComponent) {
    return <div className="ghl-widget-status">Unknown layout: {settings.layout}</div>;
  }

  return <LayoutComponent items={items} />;
}

export default AnnouncementBanner;
