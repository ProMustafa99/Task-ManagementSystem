type CacheEntry<T> = {
    value: T;
    expiry: number;
};

class InMemoryCache {
    private cacheStore: Map<string, CacheEntry<any>> = new Map();

    /**
     * Retrieves an item from the cache.
     * @param key The cache key.
     * @returns The cached value or null if not found or expired.
     */
    public get<T>(key: string): T | null {
        const entry = this.cacheStore.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.cacheStore.delete(key); // Delete expired cache entry
            return null;
        }

        return entry.value as T;
    }

    /**
     * Adds an item to the cache.
     * @param key The cache key.
     * @param value The value to cache.
     * @param ttl Time-to-live in seconds.
     */
    public set<T>(key: string, value: T, ttl: number): void {
        const expiry = Date.now() + ttl * 1000; // Convert seconds to milliseconds
        this.cacheStore.set(key, { value, expiry });
    }

    /**
     * Deletes an item from the cache.
     * @param key The cache key.
     */
    public delete(key: string): void {
        this.cacheStore.delete(key);
    }

    /**
     * Clears the entire cache.
     */
    public flush(): void {
        this.cacheStore.clear();
    }
}

const cache = new InMemoryCache();
export default cache;
