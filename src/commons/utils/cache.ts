import NodeCache from 'node-cache';
import { ApiError, notFoundError } from '../errors/api-error';

const CACHE_TTL = 36000; // 60 * 60 * 10

const cache = new NodeCache({ stdTTL: CACHE_TTL });

export function saveToCache(key: string, value: object): void {
  cache.set(key, value);
}

export function getFromCache(key: string): object {
  const value = cache.get(key);
  if (!value) {
    const message = `Cache empty for key: ${key}`;
    throw new ApiError({ ...notFoundError, message });
  }
  return value as object;
}

export function deleteFromCache(key: string): void {
  cache.del(key);
}

export function flushCache(): void {
  cache.flushAll();
}
