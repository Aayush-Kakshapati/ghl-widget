function normalizeDummyUsers(raw) {
  const users = raw?.users ?? [];

  return {
    items: users.map((user) => ({
      id: user.id,
      title: `${user.firstName} ${user.lastName}`,
      subtitle: user.email ?? "",
      image: user.image ?? null,
    })),
  };
}

function normalizeGeneric(raw) {
  const list = Array.isArray(raw) ? raw : (raw?.items ?? raw?.data ?? []);

  return {
    items: list.map((entry, index) => ({
      id: entry.id ?? index,
      title: entry.title ?? entry.name ?? "Untitled",
      subtitle: entry.subtitle ?? entry.description ?? "",
      image: entry.image ?? entry.thumbnail ?? null,
    })),
  };
}

// Maps a URL (or a recognizable fragment of one) to the normalizer that
// knows how to shape its response. Add one entry per new data source.
const NORMALIZERS = [
  {
    test: (url) => url.includes("dummyjson.com/users"),
    normalize: normalizeDummyUsers,
  },
  // { test: (url) => url.includes("/products"), normalize: normalizeProducts },
  // { test: (url) => url.includes("/announcements"), normalize: normalizeAnnouncements },
];

function getNormalizer(url) {
  const match = NORMALIZERS.find((entry) => entry.test(url));
  return match ? match.normalize : normalizeGeneric;
}

/**
 * Fetches from `url` and returns normalized { items: [...] } data.
 * This is the only function the rest of the app should call.
 */
export async function fetchWidgetData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const raw = await response.json();
  const normalize = getNormalizer(url);

  return normalize(raw);
}
