import { describe, expect, it, vi } from "vitest";
import { scrollIntoContainer } from "./scroll-into-container";

function fakeEl(
  rect: { top: number; bottom: number; height: number },
  extras: Partial<HTMLElement> & {
    clientHeight?: number;
    scrollHeight?: number;
    scrollTop?: number;
    scrollTo?: ReturnType<typeof vi.fn>;
  } = {},
): HTMLElement {
  return {
    getBoundingClientRect: () =>
      ({
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        left: 0,
        right: 100,
        width: 100,
        x: 0,
        y: rect.top,
        toJSON: () => ({}),
      }) as DOMRect,
    clientHeight: extras.clientHeight ?? 0,
    scrollHeight: extras.scrollHeight ?? 0,
    scrollTop: extras.scrollTop ?? 0,
    scrollTo: extras.scrollTo,
  } as unknown as HTMLElement;
}

describe("scrollIntoContainer", () => {
  it("scrolls only via container.scrollTo when child is below the fold", () => {
    const scrollTo = vi.fn();
    const container = fakeEl(
      { top: 0, bottom: 200, height: 200 },
      {
        clientHeight: 200,
        scrollHeight: 800,
        scrollTop: 0,
        scrollTo,
      },
    );
    const child = fakeEl({ top: 350, bottom: 390, height: 40 });

    scrollIntoContainer(child, container, { behavior: "auto", block: "nearest" });

    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: expect.any(Number), behavior: "auto" }),
    );
  });

  it("no-ops when the child is already visible", () => {
    const scrollTo = vi.fn();
    const container = fakeEl(
      { top: 0, bottom: 200, height: 200 },
      {
        clientHeight: 200,
        scrollHeight: 800,
        scrollTop: 0,
        scrollTo,
      },
    );
    const child = fakeEl({ top: 40, bottom: 80, height: 40 });

    scrollIntoContainer(child, container, { behavior: "auto", block: "nearest" });
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
