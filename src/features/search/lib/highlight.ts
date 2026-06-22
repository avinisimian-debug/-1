export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitHighlightParts(
  text: string,
  query: string,
): Array<{ text: string; highlight: boolean }> {
  const trimmed = query.trim();
  if (!trimmed) return [{ text, highlight: false }];

  const regex = new RegExp(`(${escapeRegExp(trimmed)})`, "gi");
  const parts = text.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      highlight: part.toLowerCase() === trimmed.toLowerCase(),
    }));
}
