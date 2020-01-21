import { PagingDataFetchStrategy } from './../../core/strategies/paging-data-fetch-strategy';

export abstract class PagingStrategyFactory {
    abstract createCustomUrlStrategy(endpointUrl: string, pageSize?: number): PagingDataFetchStrategy;
    abstract createStrategyWithParams(paramMap: Map<string, string>, pageSize?: number): PagingDataFetchStrategy;
}

export const MY_ASSIGNED_QUIZ_URL = 'currentUserId/assignedQuiz';
export const MY_QUIZ_URL = 'currentUserId/quiz';
