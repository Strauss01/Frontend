import { useEffect, useRef, useCallback } from "react";

interface UsePollingOptions<T> {
  /** Function to call on each interval */
  fn: () => Promise<T>;
  /** Interval in ms (default 2500) */
  interval?: number;
  /** Max duration before timeout in ms (default 5 minutes) */
  timeout?: number;
  /** Whether polling is active */
  enabled: boolean;
  /** Called on each successful result */
  onData: (data: T) => void;
  /** Called when polling times out */
  onTimeout?: () => void;
  /** Called on fetch error */
  onError?: (error: Error) => void;
}

/**
 * Polls an async function at a fixed interval.
 * Automatically cancels on unmount or when `enabled` becomes false.
 */
export function usePolling<T>({
  fn,
  interval = 2500,
  timeout = 5 * 60 * 1000,
  enabled,
  onData,
  onTimeout,
  onError,
}: UsePollingOptions<T>) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    cancelledRef.current = false;
    startTimeRef.current = Date.now();

    const tick = async () => {
      if (cancelledRef.current) return;

      // Timeout guard
      if (
        startTimeRef.current &&
        Date.now() - startTimeRef.current > timeout
      ) {
        onTimeout?.();
        return;
      }

      try {
        const result = await fn();
        if (!cancelledRef.current) {
          onData(result);
          // Schedule next tick only if not cancelled inside onData
          if (!cancelledRef.current) {
            timerRef.current = setTimeout(tick, interval);
          }
        }
      } catch (err) {
        if (!cancelledRef.current) {
          onError?.(err instanceof Error ? err : new Error(String(err)));
          // Retry after interval even on error
          timerRef.current = setTimeout(tick, interval);
        }
      }
    };

    tick();

    return () => {
      stop();
    };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return { stop };
}
