export function createHtml(settings) {
  return `
    <div
      id="ghl-widget"
      class="ghl-widget layout-${settings.layout}"
    ></div>
  `;
}