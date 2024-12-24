type CacheEntry<T> = {
    value: T;
    expiry: number;
};

class InMemoryCache {
    private cacheStore: Map<string, CacheEntry<any>> = new Map();

    public get<T>(key: string): T | null {
        const entry = this.cacheStore.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.cacheStore.delete(key); // Delete expired cache entry
            return null;
        }

        return entry.value as T;
    }

    public set<T>(key: string, value: T, ttl: number): void {
        const expiry = Date.now() + ttl * 1000; 
        this.cacheStore.set(key, { value, expiry });
    }

    public delete(key: string): void {
        this.cacheStore.delete(key);
    }

    public flush(): void {
        this.cacheStore.clear();
    }
}

const cache = new InMemoryCache();
export default cache;
