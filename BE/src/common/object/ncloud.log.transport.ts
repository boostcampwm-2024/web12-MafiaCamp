import * as Transport from 'winston-transport';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { clearInterval, setImmediate } from 'timers';

export class NcloudLogTransport extends Transport {
  private s3: AWS.S3;
  private bucket: string;
  private currentDate: string;
  private logBuffer: string[] = [];
  private uploadInterval: NodeJS.Timeout;
  private isUploading: boolean;

  constructor(configService: ConfigService) {
    super();
    this.s3 = new AWS.S3({
      endpoint: configService.get('NCLOUD_ENDPOINT'),
      region: configService.get<string>('NCLOUD_REGION'),
      credentials: {
        accessKeyId: configService.get<string>('NCLOUD_ACCESS_KEY'),
        secretAccessKey: configService.get<string>('NCLOUD_SECRET_KEY'),
      },
    } as AWS.S3.ClientConfiguration);

    this.bucket = configService.get('NCLOUD_BUCKET_NAME');
    this.currentDate = new Date().toISOString().split('T')[0];
    this.isUploading = false;

    this.uploadInterval = setInterval(async () => {
      await this.uploadLogs();
    }, 5 * 60 * 1000);

    // 날짜 변경 체크
    this.checkDateChange();
  }

  private checkDateChange() {
    setInterval(async () => {
      const newDate = new Date().toISOString().split('T')[0];
      if (this.currentDate !== newDate) {
        await this.uploadLogs();
        this.currentDate = newDate;
        this.logBuffer = [];
      }
    }, 60 * 1000);
  }

  private async uploadLogs() {
    if (this.isUploading || this.logBuffer.length === 0) return;

    this.isUploading = true;
    const currentBuffer = [...this.logBuffer];
    this.logBuffer = [];

    const fileName = `${this.currentDate}.log`;
    try {
      let existingContent = '';
      try {
        const existingLog = await this.s3.getObject({
          Bucket: this.bucket,
          Key: fileName,
        }).promise();
        existingContent = existingLog.Body.toString();
      } catch (error) {
        console.error(error);
      }

      const newContent = currentBuffer.join('\n') + '\n';
      const updatedContent = existingContent + newContent;

      await this.s3.putObject({
        Bucket: this.bucket,
        Key: fileName,
        Body: updatedContent,
        ContentType: 'application/json',
      }).promise();

    } catch (error) {
      console.error(error);
      this.logBuffer = [...currentBuffer, ...this.logBuffer];
    } finally {
      this.isUploading = false;
    }
  }

  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    this.logBuffer.push(JSON.stringify(info));
    callback();
  }

  async close() {
    clearInterval(this.uploadInterval);
    await this.uploadLogs();
  }
}