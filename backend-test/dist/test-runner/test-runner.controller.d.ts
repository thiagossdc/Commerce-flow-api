export declare class TestRunnerController {
    getTestRunner(): string;
    runTests(): Promise<{
        output: string;
        error: string;
    }>;
}
