import { ClientDataService } from './../services/client-data.service';
import { ParameterFetchingStrategy } from './../../core/strategies/parameter-fetching-strategy';
import { Injectable } from '@angular/core';
import { QuizService } from './../../feed/services/quiz.service';
import { UserService } from './../../core/services/user-service.service';
import { CustomUrlFetchingStrategy } from './../../core/strategies/custom-url-fetching-strategy';
import { User } from './../models/user';
import { AuthenticationService } from './../../core/services/authentication.service';
import { PagingDataFetchStrategy } from './../../core/strategies/paging-data-fetch-strategy';
import { PagingStrategyFactory, MY_ASSIGNED_QUIZ_URL, MY_QUIZ_URL, Service, USER_ANSWERS_FOR_QUIZ } from './paging-strategy-factory';

@Injectable()
export class PagingStrategyFactoryImpl extends PagingStrategyFactory {
    private static readonly DEFAULT_PAGE_SIZE = 50;
    constructor(private authService: AuthenticationService,
        private userService: UserService,
        private quizService: QuizService) {
        super();
    }

    public async createCustomUrlStrategy(endpointUrl: string,
        urlParameters?: Map<string, string>,
        pageSize?: number): Promise<PagingDataFetchStrategy> {
        const thePageSize: number = pageSize ? pageSize : PagingStrategyFactoryImpl.DEFAULT_PAGE_SIZE;
        switch (endpointUrl) {
            case MY_ASSIGNED_QUIZ_URL: {
                this.validateParameters(urlParameters, ['currentUserId']);
                const currentUserId: string = urlParameters.get('currentUserId');
                if (!currentUserId) {
                    throw new Error(
                        'Cannot create paging strategy for assigned quiz because the current user url is not defined'
                    );
                }
                const urlForFetchingQuizList = `${currentUserId}/assignedQuiz`;
                return new CustomUrlFetchingStrategy(this.userService,
                    urlForFetchingQuizList,
                    thePageSize);
                break;
            }
            case MY_QUIZ_URL: {
                this.validateParameters(urlParameters, ['currentUserId']);
                const currentUserId: string = urlParameters.get('currentUserId');
                const urlForFetchingQuizList = `${currentUserId}/quiz`;
                return new CustomUrlFetchingStrategy(this.userService,
                    urlForFetchingQuizList,
                    thePageSize);
            }
            case USER_ANSWERS_FOR_QUIZ: {
                this.validateParameters(urlParameters, ['quizId']);
                const quizId: string = urlParameters.get('quizId');
                const urlForFetchingQuizList = `${quizId}/user-answer`;
                return new CustomUrlFetchingStrategy(this.quizService,
                    urlForFetchingQuizList,
                    thePageSize);
            }
            default: {
                return null;
            }
        }
    }

    private validateParameters(urlParametersMap: Map<string, string>, parameters: string[]): void {
        if (!urlParametersMap) {
            throw new Error('Parameters must be defined');
        }
        if (parameters) {
            for (const param of parameters) {
                if (!urlParametersMap.has(param)) {
                    throw new Error(`Parameter ${param} is missing`);
                }
            }
        }
    }

    public async createStrategyWithParams(service: Service,
        paramMap: Map<string, string>,
        pageSize?: number): Promise<PagingDataFetchStrategy> {
        let serviceForFetching: ClientDataService;
        if (service === Service.Quiz) {
            serviceForFetching = this.quizService;
        } else if (service === Service.User) {
            serviceForFetching = this.userService;
        } else {
            throw Error(`Unsupported service: ${service}`);
        }
        return new ParameterFetchingStrategy(serviceForFetching,
            paramMap,
            pageSize ? pageSize : PagingStrategyFactoryImpl.DEFAULT_PAGE_SIZE);
    }

    public async createSearchPageableStrategy(service: Service,
        searchField: string, searchQuery: string): Promise<PagingDataFetchStrategy> {
        const searchQueryValue = `${searchField}:${searchQuery}`;
        const params = new Map<string, string>([['search', searchQueryValue]]);
        return await this.createStrategyWithParams(service, params);
    }
}
