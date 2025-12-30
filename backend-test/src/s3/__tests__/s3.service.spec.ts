import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '../s3.service';
import { Upload } from '@aws-sdk/lib-storage';

jest.mock('@aws-sdk/lib-storage');

describe('S3Service', () => {
  let service: S3Service;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUpload = {
    done: jest.fn(),
  };

  beforeEach(async () => {
    (Upload as jest.MockedClass<typeof Upload>).mockImplementation(() => mockUpload as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload file and return URL', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        buffer: Buffer.from('file content'),
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      const key = 'test-key';
      const bucket = 'test-bucket';
      const region = 'us-east-1';
      const expectedUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

      mockConfigService.get.mockImplementation((key: string) => {
        switch (key) {
          case 'S3_BUCKET':
            return bucket;
          case 'AWS_REGION':
            return region;
          case 'AWS_ACCESS_KEY_ID':
            return 'test-key';
          case 'AWS_SECRET_ACCESS_KEY':
            return 'test-secret';
          default:
            return undefined;
        }
      });

      mockUpload.done.mockResolvedValue({
        Location: expectedUrl,
        Key: key,
      });

      const result = await service.uploadFile(mockFile, key);

      expect(Upload).toHaveBeenCalledWith({
        client: expect.any(Object),
        params: {
          Bucket: bucket,
          Key: key,
          Body: mockFile.buffer,
          ACL: 'public-read',
          ContentType: mockFile.mimetype,
        },
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      expect(mockUpload.done).toHaveBeenCalled();
      expect(result).toBe(expectedUrl);
    });

    it('should handle upload errors', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        buffer: Buffer.from('file content'),
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      const key = 'test-key';
      const error = new Error('Upload failed');

      mockConfigService.get.mockReturnValue('test-bucket');
      mockUpload.done.mockRejectedValue(error);

      await expect(service.uploadFile(mockFile, key)).rejects.toThrow('Upload failed');
    });
  });
});
