import WidgetItemCard from "./WidgetItemCard";

function GridLayout({ items }) {
  return (
    <div className="ghl-widget ghl-widget-grid layout-grid">
      {items.map((item) => (
        <WidgetItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default GridLayout;
