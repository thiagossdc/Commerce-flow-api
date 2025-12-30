"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const s3_service_1 = require("../s3.service");
const lib_storage_1 = require("@aws-sdk/lib-storage");
jest.mock('@aws-sdk/lib-storage');
describe('S3Service', () => {
    let service;
    let configService;
    const mockConfigService = {
        get: jest.fn(),
    };
    const mockUpload = {
        done: jest.fn(),
    };
    beforeEach(async () => {
        lib_storage_1.Upload.mockImplementation(() => mockUpload);
        const module = await testing_1.Test.createTestingModule({
            providers: [
                s3_service_1.S3Service,
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();
        service = module.get(s3_service_1.S3Service);
        configService = module.get(config_1.ConfigService);
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
            };
            const key = 'test-key';
            const bucket = 'test-bucket';
            const region = 'us-east-1';
            const expectedUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
            mockConfigService.get.mockImplementation((key) => {
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
            expect(lib_storage_1.Upload).toHaveBeenCalledWith({
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
            };
            const key = 'test-key';
            const error = new Error('Upload failed');
            mockConfigService.get.mockReturnValue('test-bucket');
            mockUpload.done.mockRejectedValue(error);
            await expect(service.uploadFile(mockFile, key)).rejects.toThrow('Upload failed');
        });
    });
});
//# sourceMappingURL=s3.service.spec.js.map