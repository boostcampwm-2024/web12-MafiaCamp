export class AllocateJobRequest {

  readonly playerIds : Array<number>;
  constructor(playerIds : Array<number>) {
    this.playerIds = playerIds;
  }

}