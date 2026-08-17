import BaseCarousel from "./BaseCarousel";
import { useWidgetStore } from "../../../../store/widgetStore";

function SmallCarouselLayout({ items }) {
  const animation = useWidgetStore((state) => state.settings.carousel_animation);
  const speed = useWidgetStore((state) => state.settings.carousel_speed);

  return (
    <BaseCarousel
      items={items}
      layoutClassName="ghl-widget layout-small-carousel"
      animation={animation}
      speed={speed}
      batchSize={4}
    />
  );
}

export default SmallCarouselLayout;
