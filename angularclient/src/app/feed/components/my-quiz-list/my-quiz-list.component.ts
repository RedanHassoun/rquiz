import { filter } from 'rxjs/operators';
import { TOPIC_QUIZ_LIST_UPDATE, AppNotificationMessage } from './../../../core/model/socket-consts';
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
    private authService: AuthenticationService) {
  }

  @StartLoadingIndicator
  async ngOnInit() {
    this.pagingStrategy = await this.pagingStrategyFactory.createCustomUrlStrategy(MY_QUIZ_URL);
    this.currentUserId = (await this.authService.getCurrentUser()).id;
    this.subscriptions.push(
      this.notificationService.onMessage(TOPIC_QUIZ_LIST_UPDATE)
        .pipe(filter(message => this.isCreatedByCurrentUser(message)))
        .subscribe((message: AppNotificationMessage) => {
          this.handleQuizListUpdate(message);
        })
    );
  }

  private isCreatedByCurrentUser(message: AppNotificationMessage): boolean {
    if (!message || !message.content) {
      return false;
    }

    try {
      const quiz: Quiz = JSON.parse(message.content);
      if (quiz.creator.id === this.currentUserId) {
        return true;
      }
      return false;
    } catch (ex) {
      console.error(
        `An error ocurred while handling quiz list update. Error: ${AppUtil.getFullException(ex)}`);
      return false;
    }
  }

  private handleQuizListUpdate(message: AppNotificationMessage): void {
    if (!message || !message.content) {
      return;
    }

    const quiz: Quiz = JSON.parse(message.content);
    if (!quiz.isPublic) {
      return;
    }
    this.quizList.unshift(quiz);
  }

  quizListChanged(newQuizList: Quiz[]) {
    if (this.quizList && this.quizList.length === 0) {
      AppUtil.triggerLoadingIndicatorStop();
    }
    this.quizList = _.concat(this.quizList, newQuizList);
  }
}
