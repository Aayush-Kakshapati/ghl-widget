import { useState } from "react";
import { fetchWidgetData } from "../services/apiService";

export function useWidgetData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchData(url) {
    if (!url) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await fetchWidgetData(url);

      setData(result);
    } catch (error) {
      console.error(
        "Failed to fetch widget data:",
        error
      );

      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    error,
    fetchData,
  };
}