import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
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

    await this.client.hset('userInfo', { userId: 'Dummy', nickName: 'Dummy' });
    await this.client.hset('onlineUser', {
      userId: 'Dummy',
      nickName: 'Dummy',
    });
    await this.client.setbit('inLobby', 0, 0);
    await this.client.setbit('room', 0, 0);

    await pipeline.exec();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
