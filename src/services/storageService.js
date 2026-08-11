//used for development / has been removed after the working widget version was published

/* const STORAGE_KEY = "announcement-widget";

export function saveWidget(settings) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settings)
  );
}

export function loadWidget() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Invalid widget data:", error);
    return null;
  }
}

export function clearWidget() {
  localStorage.removeItem(STORAGE_KEY);
} */