import WidgetItemCard from "./WidgetItemCard";
import { useWidgetStore } from "../../../../store/widgetStore";

// Grid layout: column count and item box size come from settings
function GridLayout({ items }) {
  const itemWidth = useWidgetStore((state) => state.settings.item_width);
  const itemHeight = useWidgetStore((state) => state.settings.item_height);
  const columns = useWidgetStore((state) => state.settings.grid_columns);

  const gridStyle = {
    "--grid-item-width": itemWidth ? `${itemWidth}px` : undefined,
    "--grid-item-height": itemHeight ? `${itemHeight}px` : "auto",
    "--grid-columns": columns && Number(columns) > 0 ? Number(columns) : undefined,
  };

  return (
    <div
      className={`ghl-widget ghl-widget-grid layout-grid ${
        columns && Number(columns) > 0 ? "grid-fixed-columns" : "grid-auto-columns"
      }`}
      style={gridStyle}
    >
      {items.map((item) => (
        <WidgetItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default GridLayout;
