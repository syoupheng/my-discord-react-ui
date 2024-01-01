import useLocalStorage from "@/hooks/shared/useLocalStorage";
import { renderHook, act } from "@testing-library/react";

const localStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key]),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
};

describe("useLocalStorage - custom hook", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock());
  });

  it("should return the default value if no value is stored in localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test", "default"));
    expect(result.current[0]).toEqual("default");
  });

  it("should synchronize the default value with localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test", "default"));
    expect(result.current[0]).toEqual("default");
    expect(localStorage.getItem).toHaveBeenCalledOnce();
    expect(localStorage.getItem).toHaveBeenCalledWith("test");
    expect(localStorage.setItem).toHaveBeenCalledOnce();
    expect(localStorage.setItem).toHaveBeenCalledWith("test", JSON.stringify("default"));
    expect(localStorage.getItem("test")).toEqual(JSON.stringify("default"));
  });

  it("should update the state value when calling the setter", () => {
    const { result } = renderHook(() => useLocalStorage("test", "default"));
    expect(result.current[0]).toEqual("default");
    act(() => result.current[1]("new value"));
    expect(result.current[0]).toEqual("new value");
  });

  it("should update the localStorage value when calling the setter", () => {
    const { result } = renderHook(() => useLocalStorage("test", "default"));
    expect(result.current[0]).toEqual("default");
    expect(localStorage.getItem("test")).toEqual(JSON.stringify("default"));
    act(() => result.current[1]("new value"));
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenLastCalledWith("test", JSON.stringify("new value"));
    expect(localStorage.getItem("test")).toEqual(JSON.stringify("new value"));
  });
});
