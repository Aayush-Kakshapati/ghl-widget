import WidgetItemCard from "./WidgetItemCard";
import { useWidgetStore } from "../../../../store/widgetStore";

function GridLayout({ items }) {
  const itemWidth = useWidgetStore((state) => state.settings.item_width);
  const itemHeight = useWidgetStore((state) => state.settings.item_height);
  const columns = Math.max(1, Number(useWidgetStore((state) => state.settings.grid_columns)) || 1);

  const gridStyle = {
    "--grid-item-width": itemWidth ? `${itemWidth}px` : undefined,
    "--grid-item-height": itemHeight ? `${itemHeight}px` : "auto",
    "--grid-columns": columns,
  };

  return (
    <div className="ghl-widget ghl-widget-grid layout-grid grid-fixed-columns" style={gridStyle}>
      {items.map((item) => (
        <WidgetItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default GridLayout;
