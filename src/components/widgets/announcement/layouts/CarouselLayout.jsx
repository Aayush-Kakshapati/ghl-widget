import BaseCarousel from "./BaseCarousel";
import { useWidgetStore } from "../../../../store/widgetStore";

function CarouselLayout({ items }) {
  const animation = useWidgetStore((state) => state.settings.carousel_animation);
  const speed = useWidgetStore((state) => state.settings.carousel_speed);

  return (
    <BaseCarousel
      items={items}
      layoutClassName="ghl-widget layout-carousel"
      animation={animation}
      speed={speed}
      batchSize={3}
    />
  );
}

export default CarouselLayout;
