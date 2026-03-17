


const promises = new Map<string, Promise<unknown>>();

export function asCached<Ret>(id: string, cb: () => Promise<Ret>, forceRefresh?: boolean): Promise<Ret> {
  if (forceRefresh || !promises.has(id)) {
    promises.set(id, cb());
  }

  return promises.get(id) as Promise<Ret>;
}
