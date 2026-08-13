import WidgetItemCard from "./WidgetItemCard";

function ListLayout({ items }) {
  return (
    <div className="ghl-widget ghl-widget-list layout-list">
      {items.map((item) => (
        <WidgetItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default ListLayout;
