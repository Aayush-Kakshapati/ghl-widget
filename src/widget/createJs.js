// createJs.js
//
// Generates the vanilla-JS runtime that ships inside the published GHL
// embed. It mirrors the exact same pipeline as the React preview:
//   fetch(api.url) -> normalize into {id,title,subtitle,image} -> render by layout
//
// `settings` here is the same elementStore object the React app edits, so
// normalizer coverage only needs to be maintained in one mental model even
// though this is a separate JS runtime (no bundler/imports available inside
// the embed, so it's inlined as a string).

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

  function layoutClassName(layout) {
    switch (layout) {
      case "list": return "ghl-widget ghl-widget-list layout-list";
      case "grid": return "ghl-widget ghl-widget-grid layout-grid";
      case "small-carousel": return "ghl-widget layout-small-carousel";
      case "carousel": return "ghl-widget layout-carousel";
      case "full-carousel": return "ghl-widget layout-full-carousel";
      default: return "ghl-widget layout-list";
    }
  }

  function render(items) {
    root.className = layoutClassName(settings.layout);
    root.innerHTML = "";
    items.forEach(function (item) {
      root.appendChild(renderItem(item));
    });
  }

  var url = settings.api && settings.api.url;
  if (!url) return;

  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error("API request failed: " + res.status);
      return res.json();
    })
    .then(function (raw) {
      var normalized = getNormalizer(url)(raw);
      render(normalized.items);
    })
    .catch(function (err) {
      console.error("Widget failed to load data:", err);
      root.textContent = "Unable to load content.";
    });
})();
`;
}
