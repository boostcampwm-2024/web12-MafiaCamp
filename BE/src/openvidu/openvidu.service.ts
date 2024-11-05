import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenviduService {
    private openViduUrl: string;
    private openViduSecret: string;

    constructor(private configService: ConfigService) {
        this.openViduUrl = this.configService.get<string>('OPENVIDU_URL');
        this.openViduSecret = this.configService.get<string>('OPENVIDU_SECRET');
    }

}
