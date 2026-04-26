import { useState, useEffect, useCallback, useRef } from "react";
import type { UseFetchOptions, UseFetchReturn } from "../types";

export function useFetch<T>(url: string, options?: UseFetchOptions): UseFetchReturn<T> {
  const timeout = options?.timeout ?? 10000;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const fetchPromise = fetch(url, {
      signal: controller.signal,
    });

    const timeoutPromise = new Promise<Response>((_, reject) => {
      timeoutRef.current = setTimeout(() => {
        reject(new Error("Request timed out"));
      }, timeout);
    });

    Promise.race([fetchPromise, timeoutPromise])
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        clearTimeout(timeoutRef.current!);
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          return;
        }
        clearTimeout(timeoutRef.current!);
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      });

    setLoading(false);
  }, [url, timeout]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}