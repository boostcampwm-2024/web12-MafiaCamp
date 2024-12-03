import { Injectable } from '@nestjs/common';
import { GameContext } from './game-context';
import { LockManager } from '../../common/utils/lock-manager';

@Injectable()
export class GameContextManager {
  private readonly lockManager = new LockManager<string>();
  private readonly gameContexts = new Map<string, GameContext>();

  async setContext(roomId: string, context: GameContext) {
    return await this.lockManager.withKeyLock(roomId,()=>{
      this.gameContexts.set(roomId, context);
    })
  }

  async getContext(roomId: string): Promise<GameContext | undefined> {
    return await this.lockManager.withKeyLock(roomId,()=>{
      return this.gameContexts.get(roomId);
    })
  }

  async removeContext(roomId: string) {
    return await this.lockManager.withKeyLock(roomId, ()=>{
      this.gameContexts.delete(roomId);
    })
  }
}