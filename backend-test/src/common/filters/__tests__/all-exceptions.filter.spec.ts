import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from '../all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    let mockResponse: any;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

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

      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
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

      filter.catch(exception, mockHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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

      filter.catch(exception as any, mockHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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

      filter.catch(exception as any, mockHost as any);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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

      filter.catch(exception, mockHost as any);

      const callArgs = mockJson.mock.calls[0][0];
      expect(callArgs.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});
