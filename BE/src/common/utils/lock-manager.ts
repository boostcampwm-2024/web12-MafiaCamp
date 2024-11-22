import { Mutex } from 'async-mutex';

export class LockManager<K> {
  private locks = new Map<K, Mutex>();
  private globalMutex = new Mutex();

  private getLock(key: K): Mutex {
    let lock = this.locks.get(key);
    if (!lock) {
      lock = new Mutex();
      this.locks.set(key, lock);
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

  async withGlobalLock<T>(callback: () => Promise<T>): Promise<T> {
    const release = await this.globalMutex.acquire();
    try {
      return await callback();
    } finally {
      release();
    }
  }

  async releaseKey(key: K): Promise<void> {
    this.locks.delete(key);
  }

  async clear(): Promise<void> {
    return this.withGlobalLock(async () => {
      this.locks.clear();
    });
  }
}