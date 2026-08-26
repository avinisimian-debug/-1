/**
 * Scroll a child into view inside a scrollable container only.
 * Unlike Element.scrollIntoView(), this never scrolls the window or
 * other ancestors — critical on mobile where nested scrollIntoView
 * jumps the page to a different section.
 */
export function scrollIntoContainer(
  child: HTMLElement,
  container: HTMLElement,
  options?: { behavior?: ScrollBehavior; block?: "nearest" | "center" },
): void {
  const behavior = options?.behavior ?? "smooth";
  const block = options?.block ?? "nearest";

  const childRect = child.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const viewTop = container.scrollTop;
  let nextTop = viewTop;

  if (block === "center") {
    const delta =
      childRect.top -
      containerRect.top -
      container.clientHeight / 2 +
      childRect.height / 2;
    nextTop = viewTop + delta;
  } else if (childRect.top < containerRect.top) {
    nextTop = viewTop + (childRect.top - containerRect.top);
  } else if (childRect.bottom > containerRect.bottom) {
    nextTop = viewTop + (childRect.bottom - containerRect.bottom);
  } else {
    return;
  }

  const max = Math.max(0, container.scrollHeight - container.clientHeight);
  nextTop = Math.max(0, Math.min(nextTop, max));

  if (Math.abs(nextTop - viewTop) < 1) return;

  if (typeof container.scrollTo === "function") {
    container.scrollTo({ top: nextTop, behavior });
  } else {
    container.scrollTop = nextTop;
  }
}
