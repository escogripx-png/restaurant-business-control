/**
 * Deterministic pseudo-random in [0, 1) from a string seed, for demo
 * fixtures only. FNV-1a folds the string into a 32-bit hash, then a
 * Murmur3-style fmix32 finalizer avalanches it — needed because seeds that
 * differ only in their last character (e.g. "seed-restaurant-1" vs
 * "seed-restaurant-2", or "-1" vs "-9") come out of plain FNV-1a only a few
 * ULPs apart, which made every demo restaurant show near-identical KPIs.
 */
export function seededRandom(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;

  return (hash >>> 0) / 0xffffffff;
}
