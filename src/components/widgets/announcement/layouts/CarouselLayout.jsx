import BaseCarousel from "./BaseCarousel";
import { useWidgetStore } from "../../../../store/widgetStore";

// Single carousel layout; density/size driven by settings, not by variant
function CarouselLayout({ items }) {
  const animation = useWidgetStore((state) => state.settings.carousel_animation);
  const speed = useWidgetStore((state) => state.settings.carousel_speed);
  const itemsPerView = useWidgetStore((state) => state.settings.carousel_items_per_view);
  const itemWidth = useWidgetStore((state) => state.settings.item_width);
  const itemHeight = useWidgetStore((state) => state.settings.item_height);

  return (
    <BaseCarousel
      items={items}
      layoutClassName="ghl-widget layout-carousel"
      animation={animation}
      speed={speed}
      itemsPerView={itemsPerView}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
    />
  );
}

export default CarouselLayout;
