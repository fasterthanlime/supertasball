export function isCheating(): boolean {
  if (typeof document !== "undefined") {
    return document.location.search.startsWith("?cheat");
  }
  return false;
}
