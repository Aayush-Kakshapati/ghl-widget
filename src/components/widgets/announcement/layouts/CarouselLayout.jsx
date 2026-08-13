import WidgetItemCard from "./WidgetItemCard";

function CarouselLayout({ items }) {
  return (
    <div className="ghl-widget layout-carousel">
      {items.map((item) => (
        <WidgetItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default CarouselLayout;
