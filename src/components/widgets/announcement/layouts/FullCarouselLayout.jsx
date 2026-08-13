import WidgetItemCard from "./WidgetItemCard";

function FullCarouselLayout({ items }) {
  return (
    <div className="ghl-widget layout-full-carousel">
      {items.map((item) => (
        <WidgetItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default FullCarouselLayout;
