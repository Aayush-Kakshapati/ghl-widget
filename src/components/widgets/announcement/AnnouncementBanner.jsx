import { useWidgetData } from "../../../hooks/useWidgetData";

function AnnouncementBanner({ settings }) {
  const { data, error } = useWidgetData(settings.api);

  const message =
    data?.message ?? settings.message;

  const buttonText =
    data?.buttonText ?? settings.buttonText;

  const buttonUrl =
    data?.buttonUrl ?? settings.buttonUrl;

  if (error) {
    console.warn(
      "API failed. Using local widget settings."
    );
  }

  return (
    <div
      className={`announcement-banner layout-${settings.layout}`}
      style={{
        backgroundColor:
          settings.colors.background,
        color:
          settings.colors.text,
      }}
    >
      <span className="banner-message">
        {message}
      </span>

      {settings.showButton && (
        <a
          className="banner-button"
          href={buttonUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            backgroundColor:
              settings.colors.button,
          }}
        >
          {buttonText}
        </a>
      )}
    </div>
  );
}

export default AnnouncementBanner;