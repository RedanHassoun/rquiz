import { PagingDataFetchStrategy } from './../../core/strategies/paging-data-fetch-strategy';

export abstract class PagingStrategyFactory {
    abstract async createCustomUrlStrategy(endpointUrl: string,urlParameters: Map<string, string>, pageSize?: number): Promise<PagingDataFetchStrategy>;
    abstract async createStrategyWithParams(service: Service, paramMap: Map<string, string>, pageSize?: number): Promise<PagingDataFetchStrategy>;
    abstract async createSearchPageableStrategy(service: Service, searchField: string, searchQuery: string): Promise<PagingDataFetchStrategy>;
}

export const MY_ASSIGNED_QUIZ_URL = 'currentUserId/assignedQuiz';
export const MY_QUIZ_URL = 'currentUserId/quiz';
export const USER_ANSWERS_FOR_QUIZ = 'quizId/user-answer';

export enum Service {
    Quiz, User
}

