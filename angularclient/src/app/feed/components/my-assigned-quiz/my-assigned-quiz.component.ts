import { WebSocketService } from './../../../shared/services/web-socket.service';
import { AppNotificationMessage } from './../../../shared/index';
import { AppConsts } from './../../../shared/util/app-consts';
import { SocketTopics } from '../../../shared/util';
import { QuizCrudService } from './../../services/quiz-crud.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { PagingStrategyFactory, MY_ASSIGNED_QUIZ_URL } from './../../../shared/factories/paging-strategy-factory';
import { AppUtil } from './../../../shared/util/app-util';
import * as _ from 'lodash';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { Quiz } from './../../../shared/models/quiz';
import { Component, OnInit } from '@angular/core';
import { StartLoadingIndicator } from './../../../shared/decorators/spinner-decorators';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-my-assigned-quiz',
  templateUrl: './my-assigned-quiz.component.html',
  styleUrls: ['./my-assigned-quiz.component.scss']
})
export class MyAssignedQuizComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  public quizList: Quiz[] = [];
  public currentUserId: string;
  public pagingStrategy: PagingDataFetchStrategy;
  appConsts: any = AppConsts; // TODO: make this more elegant

  constructor(private pagingStrategyFactory: PagingStrategyFactory,
    public authService: AuthenticationService,
    private quizCrudService: QuizCrudService,
    private webSocketService: WebSocketService) {
  }

  @StartLoadingIndicator
  async ngOnInit() {
    this.currentUserId = (await this.authService.getCurrentUser()).id;
    this.pagingStrategy = await this.pagingStrategyFactory.createCustomUrlStrategy(
      MY_ASSIGNED_QUIZ_URL, new Map<string, string>([['currentUserId', this.currentUserId]]));

    this.subscriptions.push(
      this.webSocketService.onMessage(SocketTopics.TOPIC_QUIZ_ASSIGNED_TO_USER)
        .pipe(filter((message: AppNotificationMessage) => {
          return !this.quizCrudService.isPublicQuizMessage(message);
        }))
        .subscribe((message: AppNotificationMessage) => {
          this.quizCrudService.handleAddedQuiz(message, this.quizList);
        })
    );

    this.subscriptions.push(
      this.webSocketService.onMessage(SocketTopics.TOPIC_QUIZ_ANSWERS_UPDATE)
        .subscribe((message: AppNotificationMessage) => {
          this.quizCrudService.handleQuizAnswersUpdate(message, this.quizList);
        })
    );

    this.subscriptions.push(
      this.webSocketService.onMessage(SocketTopics.TOPIC_QUIZ_DELETED_UPDATE)
        .subscribe((message: AppNotificationMessage) => {
          this.quizCrudService.handleQuizDeletedUpdate(message, this.quizList);
        })
    );
  }

  quizListChanged(newQuizList: Quiz[]) {
    if (this.quizList && this.quizList.length === 0) {
      AppUtil.triggerLoadingIndicatorStop();
    }
    this.quizList = _.concat(this.quizList, newQuizList);
  }

  getPageTitle(): string {
    return this.appConsts.MY_ASSIGNED_QUIZ_LIST_DISPLAY;
  }
}
