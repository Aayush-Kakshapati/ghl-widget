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

const NORMALIZERS = [
  {
    test: (url) => url.includes("dummyjson.com/users"),
    normalize: normalizeDummyUsers,
  },

];

function getNormalizer(url) {
  const match = NORMALIZERS.find((entry) => entry.test(url));
  return match ? match.normalize : normalizeGeneric;
}

export async function fetchWidgetData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const raw = await response.json();
  const normalize = getNormalizer(url);

  return normalize(raw);
}
