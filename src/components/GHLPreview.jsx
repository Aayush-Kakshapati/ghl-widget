function GHLPreview({ previewUrl, widget }) {
  const previewDoc = widget
    ? `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { margin: 0; padding: 12px; font-family: sans-serif; }
          </style>
        </head>
        <body>
          ${widget.html}
          <script type="text/javascript">${widget.js}</script>
        </body>
      </html>
    `
    : "";

  return (
    <div className="ghl-preview">
      <iframe
        srcDoc={previewDoc || undefined}
        title="GHL Widget Preview"
        width="100%"
        height="500"
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}

export default GHLPreview;