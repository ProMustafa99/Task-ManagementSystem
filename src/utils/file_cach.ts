import * as fs from 'fs';
import * as path from 'path';

const CACHE_FILE = path.join(__dirname, 'cache.json');
const DEFAULT_TTL = 3600; 

interface CacheData {
    value: any;
    expiry: number;
}

class FileCache {
    
    private loadCache(): Record<string, CacheData> {
        if (fs.existsSync(CACHE_FILE)) {
            const cacheFile = fs.readFileSync(CACHE_FILE, 'utf-8');
            return JSON.parse(cacheFile);
        }
        return {};
    }

    private saveCache(cache: Record<string, CacheData>) {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    }

    public get<T>(key: string): T | null {
        const cache = this.loadCache();
        const cachedData = cache[key];
        if (!cachedData) return null;

        if (cachedData.expiry < Date.now()) {
            delete cache[key];
            this.saveCache(cache);
            return null;
        }

        return cachedData.value;
    }

    public set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): void {
        const cache = this.loadCache();
        const expiry = Date.now() + ttl * 1000;
        cache[key] = { value, expiry };
        this.saveCache(cache);
    }

    public delete(key: string): void {
        const cache = this.loadCache();
        delete cache[key];
        this.saveCache(cache);
    }

    public flush(): void {
        if (fs.existsSync(CACHE_FILE)) {
            fs.unlinkSync(CACHE_FILE);
        }
    }
}

const filecache = new FileCache();
export default  filecache ;

