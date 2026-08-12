import { useState } from "react";
import { fetchWidgetData } from "../services/apiService";

export function useWidgetData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWidgetData(url);

      console.log("FETCHED DATA:", data);

      return data;
    } catch (err) {
      console.error("Failed to fetch widget data:", err);

      setError(err.message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchData,
  };
}
