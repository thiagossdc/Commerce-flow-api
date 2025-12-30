import { Job } from 'bull';
export declare class NotificacaoProcessor {
    private readonly logger;
    handleNotificacao(job: Job<any>): Promise<{
        success: boolean;
    }>;
    onCompleted(job: Job): void;
    onFailed(job: Job, err: any): void;
}
