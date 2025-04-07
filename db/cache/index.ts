// redisClient.ts
import Redis from 'ioredis';

type RedisOptions = {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
};

class Cache {
  private client: Redis;

  constructor(options?: RedisOptions) {
    this.client = new Redis({
      host: options?.host || '127.0.0.1',
      port: options?.port || 6379,
      password: options?.password,
      db: options?.db || 0,
      keyPrefix: options?.keyPrefix || '',
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        console.warn(`[Redis] Reconnecting in ${delay}ms...`);
        return delay;
      },
    });

    this.client.on('connect', () => {
      console.info('[Redis] Connected');
    });

    this.client.on('error', (err) => {
      console.error('[Redis] Error:', err.message);
    });

    this.client.on('close', () => {
      console.warn('[Redis] Connection closed');
    });
  }

  public async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error(`[Redis] Failed to get key "${key}":`, err);
      return null;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (err) {
      console.error(`[Redis] Failed to check existence of key "${key}":`, err);
      return false;
    }
  }

  public async set(key: string, value: string, ttlInSeconds?: number): Promise<boolean> {
    try {
      if (ttlInSeconds) {
        await this.client.set(key, value, 'EX', ttlInSeconds);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (err) {
      console.error(`[Redis] Failed to set key "${key}":`, err);
      return false;
    }
  }

  public async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (err) {
      console.error(`[Redis] Failed to delete key "${key}":`, err);
      return 0;
    }
  }

  public getClient(): Redis {
    return this.client;
  }

  public async quit(): Promise<void> {
    await this.client.quit();
  }
}

export default Cache;
