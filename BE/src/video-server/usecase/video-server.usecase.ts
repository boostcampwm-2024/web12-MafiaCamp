export const VIDEO_SERVER_USECASE = Symbol.for('VIDEO_SERVER_USECASE');

export interface VideoServerUsecase {
  testConnection(): Promise<boolean>;
}
