import { useEffect, useState } from "react";
import { fetchWidgetData } from "../services/apiService";

export function useWidgetData(url) {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const normalized = await fetchWidgetData(url);

        if (!cancelled) {
          setData(normalized);
        }
      } catch (err) {
        console.error("Failed to fetch widget data:", err);

        if (!cancelled) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return {
    items: data?.items ?? [],
    loading,
    error,
  };
}
