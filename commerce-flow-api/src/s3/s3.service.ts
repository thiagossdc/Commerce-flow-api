import { Injectable } from '@nestjs/common';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const bucket = this.configService.get('S3_BUCKET');

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5, // 5 MB
      leavePartsOnError: false,
    });

    const result = await upload.done();

    // retorna URL publica do arquivo
    return `https://${bucket}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
  }
}
