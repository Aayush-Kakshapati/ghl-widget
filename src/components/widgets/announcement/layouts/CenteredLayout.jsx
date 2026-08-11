function CenteredLayout({ settings }) {
  return (
    <div
      style={{
        backgroundColor: settings.colors.background,
        color: settings.colors.text,
        padding: "30px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        textAlign: "center",
        maxWidth: "600px",
      }}
    >
      <span>{settings.message}</span>

      {settings.showButton && (
        <a
          href={settings.buttonUrl}
          target="_blank"
          rel="noreferrer"
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
  );
}

export default CenteredLayout;
