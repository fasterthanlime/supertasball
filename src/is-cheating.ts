export function isCheating(): boolean {
  return document.location.search.startsWith("?cheat");
}
