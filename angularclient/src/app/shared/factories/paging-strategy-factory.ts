import { PagingDataFetchStrategy } from './../../core/strategies/paging-data-fetch-strategy';

export abstract class PagingStrategyFactory {
    abstract async createCustomUrlStrategy(endpointUrl: string, pageSize?: number): Promise<PagingDataFetchStrategy>;
    abstract async createStrategyWithParams(service: Service, paramMap: Map<string, string>, pageSize?: number): Promise<PagingDataFetchStrategy>;
}

export const MY_ASSIGNED_QUIZ_URL = 'currentUserId/assignedQuiz';
export const MY_QUIZ_URL = 'currentUserId/quiz';

export enum Service {
    Quiz, User
}

