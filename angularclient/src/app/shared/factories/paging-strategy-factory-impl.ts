import { ParameterFetchingStrategy } from './../../core/strategies/parameter-fetching-strategy';
import { Injectable } from '@angular/core';
import { QuizService } from './../../feed/services/quiz.service';
import { UserService } from './../../core/services/user-service.service';
import { CustomUrlFetchingStrategy } from './../../core/strategies/custom-url-fetching-strategy';
import { User } from './../models/user';
import { AuthenticationService } from './../../core/services/authentication.service';
import { PagingDataFetchStrategy } from './../../core/strategies/paging-data-fetch-strategy';
import { PagingStrategyFactory, MY_ASSIGNED_QUIZ_URL, MY_QUIZ_URL } from './paging-strategy-factory';

@Injectable()
export class PagingStrategyFactoryImpl extends PagingStrategyFactory {

    constructor(private authService: AuthenticationService,
                private userService: UserService,
                private quizService: QuizService) {
        super();
    }

    public async createCustomUrlStrategy(endpointUrl: string, pageSize?: number): Promise<PagingDataFetchStrategy> {
        const thePageSize: number = pageSize ? pageSize : QuizService.PAGE_SIZE;
        const currentUserId: string = (await this.authService.getCurrentUser()).id;
        switch (endpointUrl) {
            case MY_ASSIGNED_QUIZ_URL: {
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
                const urlForFetchingQuizList = `${currentUserId}/quiz`;
                return new CustomUrlFetchingStrategy(this.userService,
                      urlForFetchingQuizList,
                      thePageSize);
            }
            default: {
                return null;
            }
        }
    }

    public async createStrategyWithParams(paramMap: Map<string, string>, pageSize?: number): Promise<PagingDataFetchStrategy> {
        return new ParameterFetchingStrategy(this.quizService,
            paramMap,
            pageSize ? pageSize : QuizService.PAGE_SIZE);
    }
}