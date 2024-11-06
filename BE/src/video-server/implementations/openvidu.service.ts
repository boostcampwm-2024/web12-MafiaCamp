import { Injectable } from '@nestjs/common';
import { OpenVidu } from 'openvidu-node-client';
import { ConfigService } from '@nestjs/config';
import { VideoServerUsecase } from '../usecase/video-server.usecase';

@Injectable()
export class OpenviduService implements VideoServerUsecase {
  private openvidu: OpenVidu;

  constructor(private configService: ConfigService) {
    const OPENVIDU_URL = this.configService.get<string>('OPENVIDU_URL');
    const OPENVIDU_SECRET = this.configService.get<string>('OPENVIDU_SECRET');
    this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
  }
  async testConnection(): Promise<boolean> {
    try {
      await this.openvidu.fetch();
      console.log('OpenVidu 서버에 연결되었습니다.');
      return true;
    } catch (error) {
      console.error('OpenVidu 서버 연결 실패:', error);
      return false;
    }
  }
}
