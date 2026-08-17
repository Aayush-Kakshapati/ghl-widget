import { useEffect, useRef } from "react";

function GHLPreview({ widget }) {
  const iframeRef = useRef(null);

  // Only rebuild srcDoc (which fully reloads the iframe) when the
  // layout or API url changes - those need a fresh DOM structure and
  // a fresh fetch. Everything else (title, description, animation,
  // speed, items_num) is pushed into the already-loaded iframe via
  // postMessage so it re-renders in place instead of flickering.
  const structuralKey = widget
    ? `${widget.elementStore?.layout}::${widget.elementStore?.api?.url}`
    : "";

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

  useEffect(() => {
    if (!widget) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    // The very first mount for a given structuralKey is already loading
    // these settings via srcDoc/initial fetch - skip that redundant post.
    // For every subsequent settings change (same key, iframe already
    // loaded), push the update in instead of letting srcDoc change.
    const postUpdate = () => {
      iframe.contentWindow?.postMessage(
        { type: "ghl-widget-settings-update", settings: widget.elementStore },
        "*"
      );
    };

    if (iframe.dataset.loadedKey === structuralKey) {
      postUpdate();
    } else {
      // First load for this iframe instance: let srcDoc's own initial
      // fetch run, just mark it as loaded once ready.
      const handleLoad = () => {
        iframe.dataset.loadedKey = structuralKey;
      };
      iframe.addEventListener("load", handleLoad, { once: true });
      return () => iframe.removeEventListener("load", handleLoad);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget]);

  return (
    <div className="ghl-preview">
      <iframe
        ref={iframeRef}
        key={structuralKey}
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
