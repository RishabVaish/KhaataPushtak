import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDebounce from "../../hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 400));
    expect(result.current).toBe("hello");
  });

  it("does NOT update the debounced value before the delay elapses", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      {
        initialProps: { value: "m" },
      },
    );

    rerender({ value: "mi" });

    act(() => {
      vi.advanceTimersByTime(200); // less than the 400ms delay
    });

    // Still the OLD value — not enough time has passed.
    expect(result.current).toBe("m");
  });

  it("updates to the latest value once the delay fully elapses", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      {
        initialProps: { value: "m" },
      },
    );

    rerender({ value: "milk" });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("milk");
  });

  it("resets the timer on each rapid change — only the LAST value survives", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      {
        initialProps: { value: "m" },
      },
    );

    // Simulates fast typing: each keystroke arrives before the
    // previous timer would have fired.
    rerender({ value: "mi" });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: "mil" });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: "milk" });
    act(() => vi.advanceTimersByTime(400));

    // Only the FINAL keystroke's value should ever have been committed.
    expect(result.current).toBe("milk");
  });
});
