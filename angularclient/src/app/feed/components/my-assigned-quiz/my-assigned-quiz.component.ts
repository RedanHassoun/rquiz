import { TOPIC_QUIZ_ANSWERS_UPDATE } from 'src/app/core/common/socket-consts';
import { TOPIC_QUIZ_DELETED_UPDATE } from './../../../core/common/socket-consts';
import { QuizCrudService } from './../../services/quiz-crud.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TOPIC_QUIZ_ASSIGNED_TO_USER, AppNotificationMessage } from '../../../core/common/socket-consts';
import { NotificationService } from './../../../core/services/notification.service';
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

  constructor(private pagingStrategyFactory: PagingStrategyFactory,
    private notificationService: NotificationService,
    public authService: AuthenticationService,
    private quizCrudService: QuizCrudService) {
  }

  @StartLoadingIndicator
  async ngOnInit() {
    this.currentUserId = (await this.authService.getCurrentUser()).id;
    this.pagingStrategy = await this.pagingStrategyFactory.createCustomUrlStrategy(
      MY_ASSIGNED_QUIZ_URL, new Map<string, string>([['currentUserId', this.currentUserId]]));

    this.subscriptions.push(
      this.notificationService.onMessage(TOPIC_QUIZ_ASSIGNED_TO_USER)
        .pipe(filter((message: AppNotificationMessage) => {
          const quiz: Quiz = JSON.parse(message.content);
          return !quiz.isPublic;
        }))
        .subscribe((message: AppNotificationMessage) => {
          this.quizCrudService.handleAddedQuiz(message, this.quizList);
        })
    );

    this.subscriptions.push(
      this.notificationService.onMessage(TOPIC_QUIZ_ANSWERS_UPDATE)
        .subscribe((message: AppNotificationMessage) => {
          this.quizCrudService.handleQuizAnswersUpdate(message, this.quizList);
        })
    );

    this.subscriptions.push(
      this.notificationService.onMessage(TOPIC_QUIZ_DELETED_UPDATE)
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
}
