import { Mutex } from 'async-mutex';

export class MutexMap<K, V> {
  private map = new Map<K, V>();
  private mutex: Mutex = new Mutex();

  constructor() {
  }

  private async withLock<T>(callback: (map: Map<K, V>) => T | Promise<T>): Promise<T> {
    const release = await this.mutex.acquire();
    try {
      return await callback(this.map);
    } finally {
      release();
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

}