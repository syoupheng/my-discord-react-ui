import useRequestTimeout from "@/hooks/shared/useRequestTimeout";
import { renderHook } from "@/tests/test-utils";

const onTimeout = vi.fn();

describe("useRequestTimeout - custom hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call the onTimeout callback after the timeout", () => {
    renderHook(() => useRequestTimeout({ isLoading: true, onTimeout }));
    expect(onTimeout).not.toHaveBeenCalled();
    vi.advanceTimersToNextTimer();
    expect(onTimeout).toHaveBeenCalledOnce();
  });

  it("should call the onTimeout callback after the timeout specified", () => {
    const timeout = 2000;
    renderHook(() => useRequestTimeout({ isLoading: true, onTimeout, timeout }));
    expect(onTimeout).not.toHaveBeenCalled();
    vi.advanceTimersByTime(timeout);
    expect(onTimeout).toHaveBeenCalledOnce();
  });

  it("should not call the onTimeout callback if the request resolves before the timeout", () => {
    const timeout = 2000;
    const { rerender } = renderHook(() => useRequestTimeout({ isLoading: true, onTimeout }));
    vi.advanceTimersByTime(timeout / 2);
    // The request resolves halfway through the timeout
    rerender(() => useRequestTimeout({ isLoading: false, onTimeout }));
    vi.advanceTimersByTime(timeout / 2);
    expect(onTimeout).not.toHaveBeenCalled();
  });
});
