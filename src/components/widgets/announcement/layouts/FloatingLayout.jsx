import { useState } from "react";
import WidgetItemCard from "./WidgetItemCard";
import { useWidgetStore } from "../../../../store/widgetStore";

function FloatingLayout({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const title = useWidgetStore((state) => state.settings.title);
  const position = useWidgetStore((state) => state.settings.floating_position);
  const panelSide = useWidgetStore((state) => state.settings.floating_panel_side);

  const label = title?.trim() ? title : "User Data";
  const resolvedPosition = position || "bottom-right";
  const resolvedPanelSide = panelSide || "right";

  return (
    <div className={`ghl-floating-widget ghl-floating-${resolvedPosition}`}>
      <button
        type="button"
        className="ghl-floating-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {label}
      </button>

      <div
        className={`ghl-floating-overlay ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`ghl-floating-panel ghl-floating-panel-${resolvedPanelSide} ${
          isOpen ? "is-open" : ""
        }`}
      >
        <div className="ghl-floating-panel-header">
          <strong>{label}</strong>
          <button
            type="button"
            className="ghl-floating-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="ghl-floating-panel-body">
          <div className="ghl-widget ghl-widget-list layout-list">
            {items.map((item) => (
              <WidgetItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingLayout;
