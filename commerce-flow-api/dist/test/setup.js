jest.mock('redis', () => ({
    createClient: jest.fn(() => ({
        connect: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn().mockResolvedValue(undefined),
        on: jest.fn(),
        subscribe: jest.fn(),
        publish: jest.fn(),
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
    })),
}));
jest.mock('bull', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
        process: jest.fn(),
        on: jest.fn(),
        close: jest.fn().mockResolvedValue(undefined),
    })),
    Queue: jest.fn().mockImplementation(() => ({
        add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
        process: jest.fn(),
        on: jest.fn(),
        close: jest.fn().mockResolvedValue(undefined),
    })),
}));
process.env.NODE_ENV = 'test';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.DATABASE_URI = 'mongodb://localhost:27017/backend-test-test';
//# sourceMappingURL=setup.js.map