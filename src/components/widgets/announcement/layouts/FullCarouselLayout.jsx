import BaseCarousel from "./BaseCarousel";
import { useWidgetStore } from "../../../../store/widgetStore";

function FullCarouselLayout({ items }) {
  const animation = useWidgetStore((state) => state.settings.carousel_animation);
  const speed = useWidgetStore((state) => state.settings.carousel_speed);

  return (
    <BaseCarousel
      items={items}
      layoutClassName="ghl-widget layout-full-carousel"
      animation={animation}
      speed={speed}
      batchSize={1}
    />
  );
}

export default FullCarouselLayout;
