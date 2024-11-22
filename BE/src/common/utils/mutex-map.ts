import { Mutex } from 'async-mutex';

export class MutexMap<K, V> {
  private _map = new Map<K, V>();
  private _locks = new Map<K, Mutex>();
  private globalMutex = new Mutex();

  private getLock(key: K): Mutex {
    let lock = this._locks.get(key);
    if (!lock) {
      lock = new Mutex();
      this._locks.set(key, lock);
    }
    return lock;
  }

  async withKeyLock<T>(key: K, callback: () => Promise<T>): Promise<T> {
    const lock = this.getLock(key);
    const release = await lock.acquire();
    try {
      return await callback();
    } finally {
      release();
    }
  }

  async set(key: K, value: V): Promise<this> {
    const lock = this.getLock(key);
    const release = await lock.acquire();
    try {
      this._map.set(key, value);
      return this;
    } finally {
      release();
    }
  }

  async get(key: K): Promise<V> {
    const lock = this.getLock(key);
    const release = await lock.acquire();
    try {
      return this._map.get(key);
    } finally {
      release();
    }
  }

  async delete(key: K): Promise<boolean> {
    const lock = this.getLock(key);
    const release = await lock.acquire();
    try {
      const result = this._map.delete(key);
      this._locks.delete(key);
      return result;
    } finally {
      release();
    }
  }

  async has(key: K): Promise<boolean> {
    const lock = this.getLock(key);
    const release = await lock.acquire();
    try {
      return this._map.has(key);
    } finally {
      release();
    }
  }

  private async withGlobalLock<T>(callback: () => Promise<T> | T): Promise<T> {
    const release = await this.globalMutex.acquire();
    try {
      return await callback();
    } finally {
      release();
    }
  }

  async clear(): Promise<void> {
    return this.withGlobalLock(async () => {
      this._locks.clear();
      this._map.clear();
    });
  }

  async size(): Promise<number> {
    return this.withGlobalLock(() => this._map.size);
  }

  async forEach(callbackFn: (value: V, key: K, map: Map<K, V>) => void | Promise<void>): Promise<void> {
    await this.withGlobalLock(async () => {
      const entries = Array.from(this._map.entries());
      for (const [key, value] of entries) {
        await callbackFn(value, key, this._map);
      }
    });
  }

  async map<T>(callbackFn: (value: V, key: K) => T | Promise<T>): Promise<T[]> {
    return this.withGlobalLock(async () => {
      const results: T[] = [];
      const entries = Array.from(this._map.entries());
      for (const [key, value] of entries) {
        results.push(await callbackFn(value, key));
      }
      return results;
    });
  }

  async filter(
    predicate: (value: V, key: K) => boolean | Promise<boolean>,
  ): Promise<[K, V][]> {
    return this.withGlobalLock(async () => {
      const results: [K, V][] = [];
      const entries = Array.from(this._map.entries());
      for (const [key, value] of entries) {
        if (await predicate(value, key)) {
          results.push([key, value]);
        }
      }
      return results;
    });
  }

  async reduce<T>(
    callbackFn: (accumulator: T, value: V, key: K) => T | Promise<T>,
    initialValue: T,
  ): Promise<T> {
    return this.withGlobalLock(async () => {
      let accumulator = initialValue;
      const entries = Array.from(this._map.entries());
      for (const [key, value] of entries) {
        accumulator = await callbackFn(accumulator, value, key);
      }
      return accumulator;
    });
  }

  async entries(): Promise<[K, V][]> {
    return this.withGlobalLock(() => Array.from(this._map.entries()));
  }

  async values(): Promise<V[]> {
    return this.withGlobalLock(() => Array.from(this._map.values()));
  }

  async keys(): Promise<K[]> {
    return this.withGlobalLock(() => Array.from(this._map.keys()));
  }

  async setMany(entries) {
    return this.withGlobalLock(async () => {
      for (const [key, value] of entries) {
        await this.set(key, value);
      }
    });
  }

  async getMany(keys) {
    return this.withGlobalLock(async () => {
      return keys.map(key => this._map.get(key));
    });
  }
}