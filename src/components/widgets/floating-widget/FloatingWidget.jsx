import { useState } from "react";
import { useWidgetData } from "../../../hooks/useWidgetData";

function FloatingWidget({ settings }) {
  const [open, setOpen] = useState(false);
  const { items, loading, error } = useWidgetData(settings.api?.url);

  if (!settings.floating_enabled) return null;

  const title = settings.floating_title?.trim() || "User Data";
  const visibleItems = items.slice(0, Number(settings.items_num) || 0);

  return (
    <div className={`ghl-floating-widget floating-position-${settings.floating_position}`}>
      <button
        type="button"
        className="ghl-floating-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {title}
      </button>

      <aside
        className={`ghl-floating-panel floating-panel-${settings.floating_panel_side} ${
          open ? "is-open" : ""
        }`}
        aria-hidden={!open}
      >
        <div className="ghl-floating-panel-header">
          <strong>{title}</strong>
          <button
            type="button"
            className="ghl-floating-close"
            onClick={() => setOpen(false)}
            aria-label="Close user data"
          >
            ×
          </button>
        </div>

        <div className="ghl-floating-list">
          {loading && <div className="ghl-floating-state">Loading…</div>}
          {error && <div className="ghl-floating-state">Couldn't load data.</div>}
          {!loading && !error && visibleItems.length === 0 && (
            <div className="ghl-floating-state">No data available.</div>
          )}
          {!loading &&
            !error &&
            visibleItems.map((item) => (
              <div className="ghl-floating-list-item" key={item.id}>
                <strong>{item.title}</strong>
                {item.subtitle && <span>{item.subtitle}</span>}
              </div>
            ))}
        </div>
      </aside>
    </div>
  );
}

export default FloatingWidget;
