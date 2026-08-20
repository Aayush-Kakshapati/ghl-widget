import { useEffect, useMemo, useRef, useState } from "react";
import WidgetItemCard from "./WidgetItemCard";

function speedToLoopDuration(speed) {
  const clamped = Math.min(10, Math.max(1, Number(speed) || 5));
  return 40 - (clamped - 1) * ((40 - 6) / 9);
}

function speedToBatchInterval(speed) {
  const clamped = Math.min(10, Math.max(1, Number(speed) || 5));
  return 5000 - (clamped - 1) * ((5000 - 900) / 9);
}

// Single carousel used for all densities; item box size comes from
// itemsPerView (content-width based) plus optional width/height caps.
function BaseCarousel({
  items,
  layoutClassName,
  animation = "none",
  speed = 5,
  itemsPerView = 3,
  itemWidth,
  itemHeight,
}) {
  const [batchIndex, setBatchIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef(null);

  // itemsPerView = 0 means "full width" — one item spanning the whole
  // content width, ignoring any pixel width cap.
  const isFullWidth = Number(itemsPerView) === 0;
  const perView = isFullWidth ? 1 : Math.max(1, Number(itemsPerView) || 1);

  // Item flex-basis is a share of content width (via CSS var), capped by
  // an explicit pixel width if the user set one. Full-width mode skips
  // the cap so the item always fills 100% regardless of itemWidth.
  const carouselVars = {
    "--carousel-items-per-view": perView,
    "--carousel-item-width": isFullWidth
      ? "none"
      : itemWidth
      ? `${itemWidth}px`
      : undefined,
    "--carousel-item-height": itemHeight ? `${itemHeight}px` : "auto",
  };

  const effectiveBatchSize = perView;

  const batches = useMemo(() => {
    if (!items.length) return [];
    const chunks = [];
    for (let i = 0; i < items.length; i += effectiveBatchSize) {
      chunks.push(items.slice(i, i + effectiveBatchSize));
    }
    return chunks;
  }, [items, effectiveBatchSize]);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (animation !== "batch" || batches.length <= 1) {
      setBatchIndex(0);
      return;
    }

    const intervalMs = speedToBatchInterval(speed);

    intervalRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setBatchIndex((prev) => (prev + 1) % batches.length);
        setAnimating(false);
      }, Math.min(500, intervalMs * 0.4));
    }, intervalMs);

    return () => clearInterval(intervalRef.current);
  }, [animation, speed, batches.length]);

  // A single full-width item has nothing to loop/scroll against, so
  // full-width mode always renders statically regardless of animation.
  if (animation === "loop" && !isFullWidth) {
    const duration = speedToLoopDuration(speed);
    const loopItems = [...items, ...items];

    return (
      <div
        className={`${layoutClassName} carousel-anim-loop`}
        style={carouselVars}
        ref={containerRef}
      >
        <div
          className="carousel-loop-track"
          style={{ "--carousel-loop-duration": `${duration}s` }}
        >
          {loopItems.map((item, i) => (
            <WidgetItemCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    );
  }

  if (animation === "batch" && batches.length > 0) {
    const currentBatch = batches[batchIndex] || [];

    return (
      <div className={`${layoutClassName} carousel-anim-batch`} style={carouselVars}>
        <div
          className={`carousel-batch-track ${animating ? "is-leaving" : "is-entering"}`}
        >
          {currentBatch.map((item) => (
            <WidgetItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={layoutClassName} style={carouselVars}>
      {items.map((item) => (
        <WidgetItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default BaseCarousel;
