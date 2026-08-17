import { useEffect, useMemo, useRef, useState } from "react";
import WidgetItemCard from "./WidgetItemCard";

// Maps the 1-10 speed setting to real durations.
// Higher speed = shorter duration = faster motion.
function speedToLoopDuration(speed) {
  // 1 -> 40s (slow), 10 -> 6s (fast)
  const clamped = Math.min(10, Math.max(1, Number(speed) || 5));
  return 40 - (clamped - 1) * ((40 - 6) / 9);
}

function speedToBatchInterval(speed) {
  // 1 -> 5000ms (slow), 10 -> 900ms (fast)
  const clamped = Math.min(10, Math.max(1, Number(speed) || 5));
  return 5000 - (clamped - 1) * ((5000 - 900) / 9);
}

/**
 * Shared carousel renderer for small/normal/full carousel layouts.
 *
 * animation: "none" | "loop" | "batch"
 * - none: static row, horizontally scrollable (existing behavior)
 * - loop: continuous marquee-style scroll, seamless loop via duplicated items
 * - batch: groups of `batchSize` items slide in/out on an interval
 */
function BaseCarousel({ items, layoutClassName, animation = "none", speed = 5, batchSize }) {
  const [batchIndex, setBatchIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  const isFullWidthItems = layoutClassName.includes("layout-full-carousel");

  useEffect(() => {
    if (!isFullWidthItems || animation !== "loop" || !containerRef.current) return;

    const el = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width;
      if (width) setContainerWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isFullWidthItems, animation]);

  const effectiveBatchSize = batchSize || items.length || 1;

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
      // let the "leaving" animation play, then swap batch and reset
      setTimeout(() => {
        setBatchIndex((prev) => (prev + 1) % batches.length);
        setAnimating(false);
      }, Math.min(500, intervalMs * 0.4));
    }, intervalMs);

    return () => clearInterval(intervalRef.current);
  }, [animation, speed, batches.length]);

  if (animation === "loop") {
    const duration = speedToLoopDuration(speed);
    // Duplicate items once so the track can scroll -50% and loop seamlessly.
    const loopItems = [...items, ...items];

    // full-carousel items are normally sized with a % flex-basis, which
    // can't resolve correctly inside a width:max-content track - so we
    // measure the container in pixels instead for that layout only.
    const itemStyle =
      isFullWidthItems && containerWidth
        ? { flex: `0 0 ${containerWidth}px`, width: containerWidth, maxWidth: containerWidth }
        : undefined;

    return (
      <div className={`${layoutClassName} carousel-anim-loop`} ref={containerRef}>
        <div
          className="carousel-loop-track"
          style={{ "--carousel-loop-duration": `${duration}s` }}
        >
          {loopItems.map((item, i) => (
            <WidgetItemCard key={`${item.id}-${i}`} item={item} style={itemStyle} />
          ))}
        </div>
      </div>
    );
  }

  if (animation === "batch" && batches.length > 0) {
    const currentBatch = batches[batchIndex] || [];

    return (
      <div className={`${layoutClassName} carousel-anim-batch`}>
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
    <div className={layoutClassName}>
      {items.map((item) => (
        <WidgetItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default BaseCarousel;
