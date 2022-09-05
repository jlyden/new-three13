import NodeCache from 'node-cache';

const CACHE_TTL = 36000; // 60 * 60 * 10

const cache = new NodeCache({ stdTTL: CACHE_TTL });

export function saveToCache(key: string, value: object): void {
  cache.set(key, value);
}

export function getFromCache(key: string): object|undefined {
  return cache.get(key);
}