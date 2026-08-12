export async function fetchWidgetData(url) {
  const response = await fetch(url);

  const contentType =
    response.headers.get("content-type");

  const text = await response.text();

  console.log("API STATUS:", response.status);
  console.log("API CONTENT TYPE:", contentType);
  console.log("API RESPONSE:", text);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `API did not return valid JSON. Response was: ${text.slice(0, 200)}`
    );
  }
}