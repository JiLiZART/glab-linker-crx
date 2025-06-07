
export function isSelfPage(hostname: string) {
  return globalThis.location.hostname == hostname;
}
