import { createHtml } from "./createHtml";
import { createCss } from "./createCss";
import { createJs } from "./createJs";

function createWidgetId() {
  return `ghl-widget-${Math.random().toString(36).slice(2, 10)}`;
}

export function generateWidget(settings) {
  const css = createCss();
  const widgetId = settings.widget_id || createWidgetId();
  const elementStore = { ...settings, widget_id: widgetId };

  const html = `
<style>
${css}
</style>

${createHtml(elementStore, widgetId)}
`;

  return {
    html,
    js: createJs(elementStore, widgetId),
    elementStore,
  };
}