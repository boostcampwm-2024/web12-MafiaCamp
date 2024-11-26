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

    pipeline.del('userInfo');
    pipeline.del('onlineUser');
    pipeline.del('inLobby');
    pipeline.del('inRoom');

    //userInfo : 빠른 조회를 위해 접속하는 유저의 정보를 담는 hash
    pipeline.hset('userInfo', '100', JSON.stringify({ nickName: 'Dummy' }));

    //onlineUser : 현재 접속해있는 유저들의 정보를 저장하기 위한 자료구조
    pipeline.hset(
      'onlineUser',
      '100',
      JSON.stringify({
        userId: 'Dummy',
        nickName: 'Dummy',
      }),
    );

    //inLobby: userId 를 인덱스로 보아 user 가 로비인가를 판별하기 위한 비트맵
    //inRoom: userId 를 인덱스로 보아 user 가 게임방인가를 판별하기 위한 비트맵
    for (let i = 0; i < 100; i++) {
      pipeline.setbit('inLobby', i, 0);
      pipeline.setbit('inRoom', i, 0);
    }

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

  async getAllHash(hashName: string): Promise<Record<string, string>> {
    try {
      return await this.client.hgetall(hashName);
    } catch (error) {
      console.log(error);
    }
  }

  async getBitMap(bitmapName: string, index: string): Promise<number> {
    try {
      return await this.client.getbit(bitmapName, Number(index));
    } catch (error) {
      console.log(error);
    }
  }

  async updateBitMap(
    bitmapName: string,
    index: string,
    value: number,
  ): Promise<void> {
    try {
      await this.client.setbit(bitmapName, Number(index), value);
    } catch (error) {
      console.log(error);
    }
  }

  async checkBitMap(userId: string): Promise<string> {
    const [inLobby, inRoom] = await Promise.all([
      await this.getBitMap('inLobby', userId),
      await this.getBitMap('inRoom', userId),
    ]);

    if (inLobby === 1 && inRoom === 1) {
      return 'Room';
    } else if (inLobby === 1 && inRoom === 0) {
      return 'Lobby';
    } else if (inLobby === 0 && inRoom === 0) {
      return 'off';
    } else {
      return 'error';
    }
  }
}
