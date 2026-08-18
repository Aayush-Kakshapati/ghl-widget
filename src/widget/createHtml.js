export function createHtml(settings) {
  return `
    <div
      id="ghl-widget"
      class="ghl-widget-root ${settings.layout}"
    ></div>
  `;
}