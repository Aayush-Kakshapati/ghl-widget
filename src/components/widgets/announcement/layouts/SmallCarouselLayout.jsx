import WidgetItemCard from "./WidgetItemCard";

function SmallCarouselLayout({ items }) {
  return (
    <div className="ghl-widget layout-small-carousel">
      {items.map((item) => (
        <WidgetItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default SmallCarouselLayout;
