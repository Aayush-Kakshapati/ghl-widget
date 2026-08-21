export function createJs(settings, widgetId) {
  const settingsJson = JSON.stringify(settings);
  const widgetIdJson = JSON.stringify(widgetId);

  return `
(function () {
  var widgetId = ${widgetIdJson};
  var settings = ${settingsJson};
  var root = document.getElementById(widgetId);
  if (!root) return;

  function normalizeDummyUsers(raw) {
    var users = (raw && raw.users) || [];
    return {
      items: users.map(function (user) {
        return {
          id: user.id,
          title: user.firstName + " " + user.lastName,
          subtitle: user.email || "",
          image: user.image || null,
        };
      }),
    };
  }

  function normalizeGeneric(raw) {
    var list = Array.isArray(raw) ? raw : (raw && (raw.items || raw.data)) || [];
    return {
      items: list.map(function (entry, index) {
        return {
          id: entry.id != null ? entry.id : index,
          title: entry.title || entry.name || "Untitled",
          subtitle: entry.subtitle || entry.description || "",
          image: entry.image || entry.thumbnail || null,
        };
      }),
    };
  }

  function getNormalizer(url) {
    if (url.indexOf("dummyjson.com/users") !== -1) return normalizeDummyUsers;
    return normalizeGeneric;
  }

function renderItem(item) {
    // item box element; size comes from CSS vars set on its parent container
    var card = document.createElement("div");
    card.className = "ghl-widget-item";

    if (item.image) {
      var img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title;
      img.width = 50;
      img.height = 50;
      img.style.borderRadius = "6px";
      img.style.objectFit = "cover";
      card.appendChild(img);
    }

    var textWrap = document.createElement("div");

    var title = document.createElement("strong");
    title.textContent = item.title;
    textWrap.appendChild(title);

    if (item.subtitle) {
      var subtitle = document.createElement("div");
      subtitle.textContent = item.subtitle;
      textWrap.appendChild(subtitle);
    }
    card.appendChild(textWrap);
    return card;
  }

  function renderTitleDesc(){
    var titleDesc = document.createElement("div");
    titleDesc.className = "ghl-widget-header";

    if (settings.title) {
      var title = document.createElement("h1");
      title.textContent = settings.title;
      titleDesc.appendChild(title);
    }

    if (settings.description) {
      var description = document.createElement("p");
      description.textContent = settings.description;
      titleDesc.appendChild(description);
    }

    return titleDesc;
  }

  function getBodyEl() {
    root.className = "ghl-widget-root";
    var body = root.querySelector(".ghl-widget-body");
    if (!body) {
      root.innerHTML = "";
      root.appendChild(renderTitleDesc());
      body = document.createElement("div");
      body.className = "ghl-widget-body";
      root.appendChild(body);
    } else {
      var header = root.querySelector(".ghl-widget-header");
      var freshHeader = renderTitleDesc();
      if (header) {
        root.replaceChild(freshHeader, header);
      } else {
        root.insertBefore(freshHeader, body);
      }
    }
    return body;
  }

  var CAROUSEL_LAYOUTS = ["carousel"];

  function baseLayoutClassName(layout) {
    switch (layout) {
      case "list": return "ghl-widget-body ghl-widget ghl-widget-list layout-list";
      case "grid":
        var gridMode = settings.grid_columns && Number(settings.grid_columns) > 0
          ? "grid-fixed-columns"
          : "grid-auto-columns";
        return "ghl-widget-body ghl-widget ghl-widget-grid layout-grid " + gridMode;
      case "carousel": return "ghl-widget-body ghl-widget layout-carousel";
      default: return "ghl-widget-body ghl-widget layout-list";
    }
  }

  // Applies item width/height/columns/items-per-view as CSS custom
  // properties on the widget body, same vars the React preview uses.
  // items_per_view = 0 means "full width": one item per view, width
  // cap ignored.
  function applySizeVars(body) {
    var isFullWidth = Number(settings.carousel_items_per_view) === 0;

    if (settings.item_width) {
      body.style.setProperty("--grid-item-width", settings.item_width + "px");
    }
    body.style.setProperty(
      "--carousel-item-width",
      isFullWidth ? "none" : settings.item_width ? settings.item_width + "px" : "220px"
    );
    body.style.setProperty(
      "--grid-item-height",
      settings.item_height ? settings.item_height + "px" : "auto"
    );
    body.style.setProperty(
      "--carousel-item-height",
      settings.item_height ? settings.item_height + "px" : "auto"
    );
    if (settings.grid_columns) {
      body.style.setProperty("--grid-columns", settings.grid_columns);
    }
    body.style.setProperty(
      "--carousel-items-per-view",
      isFullWidth ? 1 : settings.carousel_items_per_view || 3
    );
  }

  function speedToLoopDuration(speed) {
    var clamped = Math.min(10, Math.max(1, Number(speed) || 5));
    return 40 - (clamped - 1) * ((40 - 6) / 9);
  }

  function speedToBatchInterval(speed) {
    var clamped = Math.min(10, Math.max(1, Number(speed) || 5));
    return 5000 - (clamped - 1) * ((5000 - 900) / 9);
  }

  var batchTimer = null;

  function clearBatchTimer() {
    if (batchTimer) {
      clearInterval(batchTimer);
      batchTimer = null;
    }
  }

  function renderStaticOrLoop(items, animation) {
    var isCarousel = CAROUSEL_LAYOUTS.indexOf(settings.layout) !== -1;
    var isFullWidth = Number(settings.carousel_items_per_view) === 0;
    var className = baseLayoutClassName(settings.layout);
    var body = getBodyEl();
    applySizeVars(body);

    if (isCarousel && animation === "loop" && !isFullWidth) {
      className += " carousel-anim-loop";
      body.className = className;
      body.innerHTML = "";

      var track = document.createElement("div");
      track.className = "carousel-loop-track";
      track.style.setProperty(
        "--carousel-loop-duration",
        speedToLoopDuration(settings.carousel_speed) + "s"
      );

      var loopItems = items.concat(items);
      loopItems.forEach(function (item) {
        track.appendChild(renderItem(item));
      });

      body.appendChild(track);
      return;
    }

    body.className = className;
    body.innerHTML = "";
    items.forEach(function (item) {
      body.appendChild(renderItem(item));
    });
  }

  function renderBatch(items) {
    var className = baseLayoutClassName(settings.layout) + " carousel-anim-batch";
    var body = getBodyEl();
    body.className = className;
    applySizeVars(body);

    var rawPerView = settings.carousel_items_per_view;
    var batchSize =
      rawPerView === 0 ? 1 : Number(rawPerView) > 0 ? Number(rawPerView) : 3;
    var batches = [];
    for (var i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    if (batches.length === 0) batches = [[]];

    var batchIndex = 0;

    function paintBatch(entering) {
      body.innerHTML = "";

      var track = document.createElement("div");
      track.className = "carousel-batch-track " + (entering ? "is-entering" : "is-leaving");

      batches[batchIndex].forEach(function (item) {
        track.appendChild(renderItem(item));
      });

      body.appendChild(track);
    }

    paintBatch(true);

    clearBatchTimer();

    if (batches.length > 1) {
      var intervalMs = speedToBatchInterval(settings.carousel_speed);
      var leaveDelay = Math.min(500, intervalMs * 0.4);

      batchTimer = setInterval(function () {
        // play "leaving" animation on current batch
        var track = body.querySelector(".carousel-batch-track");
        if (track) track.className = "carousel-batch-track is-leaving";

        setTimeout(function () {
          batchIndex = (batchIndex + 1) % batches.length;
          paintBatch(true);
        }, leaveDelay);
      }, intervalMs);
    }
  }

  var floatingOpen = false;

  function renderFloating(items) {
    var visibleItems = items.slice(0, settings.items_num);
    var label = settings.title && settings.title.trim() ? settings.title : "User Data";
    var position = settings.floating_position || "bottom-right";
    var panelSide = settings.floating_panel_side || "right";

    root.className = "ghl-widget-root preview-floating-stage";
    root.innerHTML = "";

    var floatingWidget = document.createElement("div");
    floatingWidget.className = "ghl-floating-widget ghl-floating-" + position;

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "ghl-floating-trigger ghl-floating-" + position ;
    trigger.textContent = label;
    trigger.addEventListener("click", function () {
      setFloatingOpen(!floatingOpen);
    });

    var overlay = document.createElement("div");
    overlay.className = "ghl-floating-overlay";
    overlay.addEventListener("click", function () {
      setFloatingOpen(false);
    });

    var panel = document.createElement("div");
    panel.className = "ghl-floating-panel ghl-floating-panel-" + panelSide;

    var header = document.createElement("div");
    header.className = "ghl-floating-panel-header";

    var headerTitle = document.createElement("strong");
    headerTitle.textContent = label;
    header.appendChild(headerTitle);

    var emptySpace = document.createElement("div");
    emptySpace.className = "ghl-floating-empty-space"

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "ghl-floating-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\u00d7";
    closeBtn.addEventListener("click", function () {
      setFloatingOpen(false);
    });
    header.appendChild(closeBtn);

    var body = document.createElement("div");
    body.className = "ghl-floating-panel-body";

    var list = document.createElement("div");
    list.className = "ghl-widget ghl-widget-list layout-list";
    visibleItems.forEach(function (item) {
      list.appendChild(renderItem(item));
    });
    body.appendChild(list);

    panel.appendChild(header);
    panel.appendChild(body);

    root.appendChild(trigger);
    floatingWidget.appendChild(overlay);
    floatingWidget.appendChild(panel);
    root.appendChild(emptySpace);
    root.appendChild(floatingWidget);

    function setFloatingOpen(open) {
      floatingOpen = open;
      overlay.className = "ghl-floating-overlay" + (open ? " is-open" : "");
      panel.className = "ghl-floating-panel ghl-floating-panel-" + panelSide + (open ? " is-open" : "");
    }
  }

  function render(items) {
    if (settings.layout === "floating") {
      renderFloating(items);
      return;
    }

    var visibleItems = items.slice(0, settings.items_num);
    var isCarousel = CAROUSEL_LAYOUTS.indexOf(settings.layout) !== -1;
    var animation = isCarousel ? settings.carousel_animation || "none" : "none";

    clearBatchTimer();

    if (animation === "batch") {
      renderBatch(visibleItems);
    } else {
      renderStaticOrLoop(visibleItems, animation);
    }
  }

  var cachedItems = null;

  function showError() {
    root.className = "ghl-widget-root";
    root.innerHTML = "";
    if (settings.layout !== "floating") {
      root.appendChild(renderTitleDesc());
    }
    var errorEl = document.createElement("div");
    errorEl.className = "ghl-widget-status";
    errorEl.textContent = "Unable to load content.";
    root.appendChild(errorEl);
  }

  function fetchAndRender() {
    var url = settings.api && settings.api.url;
    if (!url) return;

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("API request failed: " + res.status);
        return res.json();
      })
      .then(function (raw) {
        cachedItems = getNormalizer(url)(raw).items;
        render(cachedItems);
      })
      .catch(function (err) {
        console.error("Widget failed to load data:", err);
        showError();
      });
  }

  window.addEventListener("message", function (event) {
    var data = event && event.data;
    if (!data || data.type !== "ghl-widget-settings-update" || !data.settings) return;
    // ignore updates meant for a different widget instance on the same page
    if (data.settings.widget_id && data.settings.widget_id !== widgetId) return;

    var prevLayout = settings.layout;
    var prevUrl = settings.api && settings.api.url;

    settings = data.settings;

    var layoutChanged = settings.layout !== prevLayout;
    var urlChanged = (settings.api && settings.api.url) !== prevUrl;

    if (layoutChanged || urlChanged || cachedItems === null) {
      fetchAndRender();
    } else {
      render(cachedItems);
    }
  });

  fetchAndRender();
})();
`;
}
