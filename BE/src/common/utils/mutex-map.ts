import { Mutex } from 'async-mutex';

export class MutexMap<K, V> {
  private _map = new Map<K, V>();
  private mutex: Mutex = new Mutex();

  constructor() {
  }

  private async withLock<T>(callback: (map: Map<K, V>) => T | Promise<T>): Promise<T> {
    let retries = 3;
    while (retries > 0) {
      try {
        const release = await this.mutex.acquire();
        try {
          return await callback(this._map);
        } finally {
          release();
        }
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }

  async set(key: K, value: V): Promise<this> {
    await this.withLock(map => {
      map.set(key, value);
    });
    return this;
  }

  async get(key: K): Promise<V> {
    return this.withLock(map => map.get(key));
  }

  async delete(key: K): Promise<boolean> {
    return this.withLock(map => map.delete(key));
  }

  async has(key: K): Promise<boolean> {
    return this.withLock(map => map.has(key));
  }

  async clear(): Promise<void> {
    return this.withLock(map => map.clear());
  }

  async size(): Promise<number> {
    return this.withLock(map => map.size);
  }

  async forEach(callbackFn: (value: V, key: K, map: Map<K, V>) => void | Promise<void>): Promise<void> {
    await this.withLock(async map=>{
      for (const [key, value] of map.entries()) {
        await callbackFn(value, key, map);
      }
    })
  }

  async map<T>(callbackFn: (value: V, key: K) => T | Promise<T>): Promise<T[]> {
    return this.withLock(async map => {
      const results: T[] = [];
      for (const [key, value] of map.entries()) {
        results.push(await callbackFn(value, key));
      }
      return results;
    });
  }

  async filter(
    predicate: (value: V, key: K) => boolean | Promise<boolean>
  ): Promise<[K, V][]> {
    return this.withLock(async map => {
      const results: [K, V][] = [];
      for (const [key, value] of map.entries()) {
        if (await predicate(value, key)) {
          results.push([key, value]);
        }
      }
      return results;
    });
  }

  async reduce<T>(
    callbackFn: (accumulator: T, value: V, key: K) => T | Promise<T>,
    initialValue: T
  ): Promise<T> {
    return this.withLock(async map => {
      let accumulator = initialValue;
      for (const [key, value] of map.entries()) {
        accumulator = await callbackFn(accumulator, value, key);
      }
      return accumulator;
    });
  }

  async entries(): Promise<[K, V][]> {
    return this.withLock(map => Array.from(map.entries()));
  }

  async values(): Promise<V[]> {
    return this.withLock(map => Array.from(map.values()));
  }

  async keys(): Promise<K[]> {
    return this.withLock(map => Array.from(map.keys()));
  }

  async setMany(entries) {
    return this.withLock(map => {
      for (const [key, value] of entries) {
        map.set(key, value);
      }
    });
  }

  async getMany(keys) {
    return this.withLock(map => {
      return keys.map(key => map.get(key));
    });
  }
}