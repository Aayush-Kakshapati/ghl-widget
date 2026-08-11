import { createHtml } from "./createHtml";
import { createCss } from "./createCss";
import { createJs } from "./createJs";

export function generateWidget(settings) {
  const css = createCss(settings);

  const html = `
<style>
${css}
</style>

${createHtml(settings)}
`;

  return {
    html,
    js: createJs(settings),
    elementStore: settings,
  };
}
