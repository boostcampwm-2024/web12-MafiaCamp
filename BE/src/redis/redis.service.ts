import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisIOUserUseCase } from './redis-io-user.usecase';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService
  implements OnModuleInit, OnModuleDestroy, RedisIOUserUseCase
{
  private client: Redis;
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD', null);

    this.client = new Redis({
      host,
      port,
      password,
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
      return Object.entries(allHashContent).reduce((acc, [key, value]) => {
        try {
          acc[key] = JSON.parse(value);
        } catch (error) {
          acc[key] = null;
        }
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      console.log(error);
    }
  }
}
