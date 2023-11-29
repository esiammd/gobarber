/* eslint-disable @typescript-eslint/no-explicit-any */
import type ICacheProvider from '../models/ICacheProvider';

type ICacheData = Record<string, string>;

class FakeCacheProvider implements ICacheProvider {
  private readonly cache: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    if (data === undefined) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache.key;
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    console.log('this.cache', this.cache);

    keys.forEach(key => {
      console.log('key', key);
      console.log('this.cache.key', this.cache.key);
      delete this.cache.key;
    });
  }
}

export default FakeCacheProvider;
