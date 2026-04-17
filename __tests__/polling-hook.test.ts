/**
 * usePolling hook tests.
 *
 * Uses fake timers to control timing precisely.
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { usePolling } from "@/hooks/usePolling";

describe("usePolling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("calls fn immediately when enabled", async () => {
    const fn = vi.fn().mockResolvedValue("data");
    const onData = vi.fn();

    renderHook(() =>
      usePolling({ fn, enabled: true, onData, interval: 1000 })
    );

    // First tick fires immediately
    await act(async () => {
      await Promise.resolve(); // flush microtasks
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(onData).toHaveBeenCalledWith("data");
  });

  it("calls fn again after the interval", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const onData = vi.fn();

    renderHook(() =>
      usePolling({ fn, enabled: true, onData, interval: 1000 })
    );

    // First tick
    await act(async () => { await Promise.resolve(); });
    expect(fn).toHaveBeenCalledTimes(1);

    // Advance interval
    await act(async () => {
      vi.advanceTimersByTime(1000);
      await Promise.resolve();
    });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not call fn when enabled is false", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const onData = vi.fn();

    renderHook(() =>
      usePolling({ fn, enabled: false, onData, interval: 500 })
    );

    await act(async () => {
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it("calls onTimeout when timeout is exceeded", async () => {
    const fn = vi.fn().mockResolvedValue("data");
    const onData = vi.fn();
    const onTimeout = vi.fn();

    renderHook(() =>
      usePolling({
        fn,
        enabled: true,
        onData,
        onTimeout,
        interval: 100,
        timeout: 500,
      })
    );

    // First tick
    await act(async () => { await Promise.resolve(); });

    // Advance past timeout
    await act(async () => {
      vi.advanceTimersByTime(600);
      await Promise.resolve();
    });

    expect(onTimeout).toHaveBeenCalled();
  });

  it("calls onError and continues polling on failure", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValue("ok");
    const onData = vi.fn();
    const onError = vi.fn();

    renderHook(() =>
      usePolling({ fn, enabled: true, onData, onError, interval: 300 })
    );

    // First tick — fails
    await act(async () => { await Promise.resolve(); });
    expect(onError).toHaveBeenCalledWith(expect.any(Error));

    // Second tick — succeeds
    await act(async () => {
      vi.advanceTimersByTime(300);
      await Promise.resolve();
    });
    expect(onData).toHaveBeenCalledWith("ok");
  });

  it("stops polling after stop() is called", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const onData = vi.fn();

    const { result } = renderHook(() =>
      usePolling({ fn, enabled: true, onData, interval: 200 })
    );

    await act(async () => { await Promise.resolve(); });
    expect(fn).toHaveBeenCalledTimes(1);

    act(() => result.current.stop());

    await act(async () => {
      vi.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    // Should still be 1 — no additional calls after stop
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("cancels polling on unmount", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const onData = vi.fn();

    const { unmount } = renderHook(() =>
      usePolling({ fn, enabled: true, onData, interval: 200 })
    );

    await act(async () => { await Promise.resolve(); });
    unmount();

    await act(async () => {
      vi.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
