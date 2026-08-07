export function createHtml(settings) {
  return `
<div class="announcement-banner">
  <span class="banner-message">
    ${settings.message}
  </span>

  ${
    settings.showButton
      ? `
      <a
        class="banner-button"
        href="${settings.buttonUrl}"
        target="_blank"
      >
        ${settings.buttonText}
      </a>
    `
      : ""
  }
</div>
`;
}