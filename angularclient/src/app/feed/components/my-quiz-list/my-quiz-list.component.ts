import { QuizCrudService } from './../../services/quiz-crud.service';
import { filter } from 'rxjs/operators';
import { TOPIC_QUIZ_LIST_UPDATE, AppNotificationMessage } from '../../../core/common/socket-consts';
import { NotificationService } from './../../../core/services/notification.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { MY_QUIZ_URL } from './../../../shared/factories/paging-strategy-factory';
import { PagingStrategyFactory } from 'src/app/shared/factories/paging-strategy-factory';
import { AppUtil } from './../../../shared/util/app-util';
import { Quiz } from './../../../shared/models/quiz';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { StartLoadingIndicator } from './../../../shared/decorators/spinner-decorators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-quiz-list',
  templateUrl: './my-quiz-list.component.html',
  styleUrls: ['./my-quiz-list.component.scss']
})
export class MyQuizListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  public quizList: Quiz[] = [];
  public currentUserId: string;
  public pagingStrategy: PagingDataFetchStrategy;

  constructor(private pagingStrategyFactory: PagingStrategyFactory,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private quizCrudService: QuizCrudService) {
  }

  @StartLoadingIndicator
  async ngOnInit() {
    this.currentUserId = (await this.authService.getCurrentUser()).id;
    this.pagingStrategy = await this.pagingStrategyFactory.createCustomUrlStrategy(
      MY_QUIZ_URL, new Map<string, string>([['currentUserId', this.currentUserId]]));

    this.subscriptions.push(
      this.notificationService.onMessage(TOPIC_QUIZ_LIST_UPDATE)
        .pipe(filter(message => {
          try {
            const quiz: Quiz = JSON.parse(message.content);
            Object.setPrototypeOf(quiz, Quiz.prototype);
            return quiz.isCreatedByUser(this.currentUserId);
          } catch (ex) {
            console.error(`Cannot update quiz list, error: ${ex}`);
            return false;
          }
        }))
        .subscribe((message: AppNotificationMessage) => {
          this.quizCrudService.handleAddedQuiz(message, this.quizList);
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
