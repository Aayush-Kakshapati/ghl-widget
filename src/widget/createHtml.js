export function createHtml(settings, widgetId) {
  return `
    <div
      id="${widgetId}"
      class="ghl-widget-root ${settings.layout}"
    ></div>
  `;
}