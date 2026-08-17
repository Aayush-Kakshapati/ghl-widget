export function createJs(settings) {
  const settingsJson = JSON.stringify(settings);

  return `
(function () {
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

  // Ensures #ghl-widget has a stable structure:
  //   #ghl-widget (plain block wrapper, never gets layout/flex classes)
  //     .ghl-widget-header (title/description)
  //     .ghl-widget-body (gets the layout-specific class: flex/grid/carousel track)
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

  var CAROUSEL_LAYOUTS = ["small-carousel", "carousel", "full-carousel"];
  var BATCH_SIZES = { "small-carousel": 4, carousel: 3, "full-carousel": 1 };

  // Classes applied to .ghl-widget-body (the layout track), matching
  // what the React preview applies to its own layout root.
  function baseLayoutClassName(layout) {
    switch (layout) {
      case "list": return "ghl-widget-body ghl-widget ghl-widget-list layout-list";
      case "grid": return "ghl-widget-body ghl-widget ghl-widget-grid layout-grid";
      case "small-carousel": return "ghl-widget-body ghl-widget layout-small-carousel";
      case "carousel": return "ghl-widget-body ghl-widget layout-carousel";
      case "full-carousel": return "ghl-widget-body ghl-widget layout-full-carousel";
      default: return "ghl-widget-body ghl-widget layout-list";
    }
  }

  // Maps the 1-10 speed setting to real durations, matching the React preview.
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
    var className = baseLayoutClassName(settings.layout);
    var body = getBodyEl();

    if (isCarousel && animation === "loop") {
      className += " carousel-anim-loop";
      body.className = className;
      body.innerHTML = "";

      var track = document.createElement("div");
      track.className = "carousel-loop-track";
      track.style.setProperty(
        "--carousel-loop-duration",
        speedToLoopDuration(settings.carousel_speed) + "s"
      );

      // Duplicate items once so the track can scroll -50% and loop seamlessly.
      var loopItems = items.concat(items);
      loopItems.forEach(function (item) {
        var card = renderItem(item);
        if (settings.layout === "full-carousel") {
          // % flex-basis can't resolve against width:max-content, so
          // size items to the measured container width instead.
          var width = body.clientWidth || body.getBoundingClientRect().width;
          if (width) {
            card.style.flex = "0 0 " + width + "px";
            card.style.width = width + "px";
            card.style.maxWidth = width + "px";
          }
        }
        track.appendChild(card);
      });

      body.appendChild(track);
      return;
    }

    // Plain static render (no animation)
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

    var batchSize = BATCH_SIZES[settings.layout] || items.length || 1;
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

  function render(items) {
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
    root.appendChild(renderTitleDesc());
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

  // Live updates: instead of the parent page reloading this iframe's
  // whole document on every settings change (title, description, speed,
  // items_num, animation style), it posts the new settings in and we
  // just re-render in place - no reload, no re-fetch, no flicker.
  // A structural change (layout or API url) still needs a fresh fetch.
  window.addEventListener("message", function (event) {
    var data = event && event.data;
    if (!data || data.type !== "ghl-widget-settings-update" || !data.settings) return;

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
