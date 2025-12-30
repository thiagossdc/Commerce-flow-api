"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const all_exceptions_filter_1 = require("../all-exceptions.filter");
describe('AllExceptionsFilter', () => {
    let filter;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [all_exceptions_filter_1.AllExceptionsFilter],
        }).compile();
        filter = module.get(all_exceptions_filter_1.AllExceptionsFilter);
    });
    it('should be defined', () => {
        expect(filter).toBeDefined();
    });
    describe('catch', () => {
        let mockResponse;
        let mockJson;
        let mockStatus;
        beforeEach(() => {
            mockJson = jest.fn();
            mockStatus = jest.fn().mockReturnValue({ json: mockJson });
            mockResponse = {
                status: mockStatus,
                json: mockJson,
            };
        });
        it('should handle HttpException', () => {
            const mockRequest = {};
            const mockHost = {
                switchToHttp: () => ({
                    getResponse: () => mockResponse,
                }),
            };
            const exception = new common_1.HttpException('Test error', common_1.HttpStatus.BAD_REQUEST);
            filter.catch(exception, mockHost);
            expect(mockStatus).toHaveBeenCalledWith(common_1.HttpStatus.BAD_REQUEST);
            expect(mockJson).toHaveBeenCalledWith({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Test error',
                timestamp: expect.any(String),
            });
        });
        it('should handle generic Error', () => {
            const mockRequest = {};
            const mockHost = {
                switchToHttp: () => ({
                    getResponse: () => mockResponse,
                }),
            };
            const exception = new Error('Generic error');
            filter.catch(exception, mockHost);
            expect(mockStatus).toHaveBeenCalledWith(common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            expect(mockJson).toHaveBeenCalledWith({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Generic error',
                timestamp: expect.any(String),
            });
        });
        it('should handle unknown exception', () => {
            const mockRequest = {};
            const mockHost = {
                switchToHttp: () => ({
                    getResponse: () => mockResponse,
                }),
            };
            const exception = 'String error';
            filter.catch(exception, mockHost);
            expect(mockStatus).toHaveBeenCalledWith(common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            expect(mockJson).toHaveBeenCalledWith({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                timestamp: expect.any(String),
            });
        });
        it('should handle exception with message property', () => {
            const mockRequest = {};
            const mockHost = {
                switchToHttp: () => ({
                    getResponse: () => mockResponse,
                }),
            };
            const exception = { message: 'Custom error message' };
            filter.catch(exception, mockHost);
            expect(mockStatus).toHaveBeenCalledWith(common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            expect(mockJson).toHaveBeenCalledWith({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Custom error message',
                timestamp: expect.any(String),
            });
        });
        it('should include timestamp in ISO format', () => {
            const mockRequest = {};
            const mockHost = {
                switchToHttp: () => ({
                    getResponse: () => mockResponse,
                }),
            };
            const exception = new Error('Test error');
            filter.catch(exception, mockHost);
            const callArgs = mockJson.mock.calls[0][0];
            expect(callArgs.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });
    });
});
//# sourceMappingURL=all-exceptions.filter.spec.js.map