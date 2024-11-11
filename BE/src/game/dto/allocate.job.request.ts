import { IsArray, IsNumber } from 'class-validator';

export class AllocateJobRequest {
  @IsArray()
  @IsNumber({}, { each: true })
  readonly playerIds: Array<number>;
  constructor(playerIds: Array<number>) {
    this.playerIds = playerIds;
  }
}
