function AnnouncementBanner({ settings }) {
  return (
    <div>
      <div
        style={{
          backgroundColor: settings.colors.background,
          color: settings.colors.text,
          padding: "20px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          maxWidth: "600px",
        }}
      >
        {settings.showButton && (
          <a
            href={settings.buttonUrl}
            target="_blank"
            style={{
              backgroundColor: settings.colors.button,
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            {settings.buttonText}
          </a>
        )}
      </div>
    </div>
  );
}

export default AnnouncementBanner;
