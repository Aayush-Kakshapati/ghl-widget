import { createHtml } from "./createHtml";
import { createCss } from "./createCss";
import { createJs } from "./createJs";

export function generateWidget(settings) {
  return {
    html: createHtml(settings),
    css: createCss(settings),
    js: createJs(settings),

    elementStore: settings,
  };
}