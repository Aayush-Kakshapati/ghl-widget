export function createJs(settings) {
  const settingsJson = JSON.stringify(settings);

  return `
(function () {
  // Render the announcement data and optional floating user-data panel from the saved widget settings.
  var settings = ${settingsJson};
  var root = document.getElementById("ghl-widget");
  if (!root) return;

  function normalizeDummyUsers(raw) {
    var users = (raw && raw.users) || [];
    return {
      items: users.map(function (user) {
        return {
          id: user.id,
          title: user.firstName + " " + user.lastName,
          subtitle: user.email || "",
          image: user.image || null
        };
      })
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
          image: entry.image || entry.thumbnail || null
        };
      })
    };
  }

  function getNormalizer(url) {
    if (url.indexOf("dummyjson.com/users") !== -1) return normalizeDummyUsers;
    return normalizeGeneric;
  }

  function renderItem(item) {
    var card = document.createElement("div");
    card.className = "ghl-widget-item";

    if (item.image) {
      var img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title;
      img.width = 50;
      img.height = 50;
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

  function renderTitleDesc() {
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

      if (header) root.replaceChild(freshHeader, header);
      else root.insertBefore(freshHeader, body);
    }

    return body;
  }

  function baseLayoutClassName(layout) {
    if (layout === "list") return "ghl-widget-body ghl-widget ghl-widget-list layout-list";
    if (layout === "grid") return "ghl-widget-body ghl-widget ghl-widget-grid layout-grid grid-fixed-columns";
    if (layout === "carousel") return "ghl-widget-body ghl-widget layout-carousel";
    return "ghl-widget-body ghl-widget ghl-widget-list layout-list";
  }

  function applySizeVars(body) {
    var perView = Math.max(1, Number(settings.carousel_items_per_view) || 1);

    if (settings.item_width) body.style.setProperty("--grid-item-width", settings.item_width + "px");

    body.style.setProperty("--carousel-item-width", settings.item_width ? settings.item_width + "px" : "220px");
    body.style.setProperty("--grid-item-height", settings.item_height ? settings.item_height + "px" : "auto");
    body.style.setProperty("--carousel-item-height", settings.item_height ? settings.item_height + "px" : "auto");
    body.style.setProperty("--grid-columns", Math.max(1, Number(settings.grid_columns) || 1));
    body.style.setProperty("--carousel-items-per-view", perView);
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
    var isCarousel = settings.layout === "carousel";
    var className = baseLayoutClassName(settings.layout);
    var body = getBodyEl();

    applySizeVars(body);

    if (isCarousel && animation === "loop" && Number(settings.carousel_items_per_view) !== 0) {
      body.className = className + " carousel-anim-loop";
      body.innerHTML = "";

      var track = document.createElement("div");
      track.className = "carousel-loop-track";
      track.style.setProperty("--carousel-loop-duration", speedToLoopDuration(settings.carousel_speed) + "s");

      items.concat(items).forEach(function (item) {
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
    var body = getBodyEl();
    body.className = baseLayoutClassName(settings.layout) + " carousel-anim-batch";
    applySizeVars(body);

    var batchSize = Number(settings.carousel_items_per_view) === 0
      ? 1
      : Math.max(1, Number(settings.carousel_items_per_view) || 3);

    var batches = [];

    for (var i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    if (!batches.length) batches = [[]];

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
        var track = body.querySelector(".carousel-batch-track");

        if (track) track.className = "carousel-batch-track is-leaving";

        setTimeout(function () {
          batchIndex = (batchIndex + 1) % batches.length;
          paintBatch(true);
        }, leaveDelay);
      }, intervalMs);
    }
  }

  function renderAnnouncement(items) {
    var visibleItems = items.slice(0, Math.max(1, Number(settings.items_num) || 1));
    var animation = settings.layout === "carousel" ? settings.carousel_animation || "none" : "none";

    clearBatchTimer();

    if (animation === "batch") renderBatch(visibleItems);
    else renderStaticOrLoop(visibleItems, animation);
  }

  function renderFloating(items) {
    var existing = root.querySelector(".ghl-floating-widget");

    if (existing) existing.remove();
    if (!settings.floating_enabled) return;

    var title = (settings.floating_title || "").trim() || "User Data";
    var visibleItems = items.slice(0, Math.max(1, Number(settings.items_num) || 1));

    var wrapper = document.createElement("div");
    wrapper.className = "ghl-floating-widget floating-position-" + (settings.floating_position || "bottom-right");

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "ghl-floating-trigger";
    trigger.textContent = title;

    var panel = document.createElement("aside");
    panel.className = "ghl-floating-panel floating-panel-" + (settings.floating_panel_side || "right");

    var panelHeader = document.createElement("div");
    panelHeader.className = "ghl-floating-panel-header";

    var panelTitle = document.createElement("strong");
    panelTitle.textContent = title;

    var close = document.createElement("button");
    close.type = "button";
    close.className = "ghl-floating-close";
    close.textContent = "×";
    close.setAttribute("aria-label", "Close user data");

    panelHeader.appendChild(panelTitle);
    panelHeader.appendChild(close);

    var list = document.createElement("div");
    list.className = "ghl-floating-list";

    if (!visibleItems.length) {
      var empty = document.createElement("div");
      empty.className = "ghl-floating-state";
      empty.textContent = "No data available.";
      list.appendChild(empty);
    } else {
      visibleItems.forEach(function (item) {
        var row = document.createElement("div");
        row.className = "ghl-floating-list-item";

        var rowTitle = document.createElement("strong");
        rowTitle.textContent = item.title;
        row.appendChild(rowTitle);

        if (item.subtitle) {
          var rowSubtitle = document.createElement("span");
          rowSubtitle.textContent = item.subtitle;
          row.appendChild(rowSubtitle);
        }

        list.appendChild(row);
      });
    }

    panel.appendChild(panelHeader);
    panel.appendChild(list);
    wrapper.appendChild(trigger);
    wrapper.appendChild(panel);
    root.appendChild(wrapper);

    trigger.addEventListener("click", function () {
      wrapper.classList.toggle("is-open");
    });

    close.addEventListener("click", function () {
      wrapper.classList.remove("is-open");
    });
  }

  function render(items) {
    renderAnnouncement(items);
    renderFloating(items);
  }

  var cachedItems = null;

  function showError() {
    clearBatchTimer();
    root.innerHTML = "";
    root.appendChild(renderTitleDesc());

    var errorEl = document.createElement("div");
    errorEl.className = "ghl-widget-status";
    errorEl.textContent = "Unable to load content.";
    root.appendChild(errorEl);
  }

  function fetchAndRender() {
    var url = settings.api && settings.api.url;
    if (!url) {
      render([]);
      return;
    }

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

    var prevLayout = settings.layout;
    var prevUrl = settings.api && settings.api.url;

    settings = data.settings;

    var layoutChanged = settings.layout !== prevLayout;
    var urlChanged = (settings.api && settings.api.url) !== prevUrl;

    if (layoutChanged || urlChanged || cachedItems === null) fetchAndRender();
    else render(cachedItems);
  });

  fetchAndRender();
})();
`;
}
