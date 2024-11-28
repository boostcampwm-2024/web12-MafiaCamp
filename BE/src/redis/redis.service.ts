import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisIOUserUseCase } from './redis-io-user.usecase';

@Injectable()
export class RedisService
  implements OnModuleInit, OnModuleDestroy, RedisIOUserUseCase
{
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });

    await this.initializeDataStructure();
  }

  async initializeDataStructure() {
    const pipeline = this.client.pipeline();
    pipeline.del('onlineUser');
    pipeline.hset('onlineUser');
    await pipeline.exec();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async setHash(
    hashName: string,
    userId: string,
    value: string,
  ): Promise<void> {
    try {
      await this.client.hset(hashName, userId, value);
    } catch (error) {
      console.log(error);
    }
  }

  async delHash(hashName: string, userId: string): Promise<void> {
    try {
      await this.client.hdel(hashName, userId);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllHash(hashName: string): Promise<Record<any, any>> {
    try {
      const allHashContent = await this.client.hgetall(hashName);
      console.log(Object.entries(allHashContent));

      const parsedHash = Object.entries(allHashContent).reduce(
        (acc, [key, value]) => {
          try {
            acc[key] = JSON.parse(value);
          } catch (error) {
            console.error(`Error parsing key "${key}":`, error);
            acc[key] = null;
          }
          return acc;
        },
        {} as Record<string, any>,
      );
      console.log(parsedHash);
      return parsedHash;
    } catch (error) {
      console.log(error);
    }
  }
}
