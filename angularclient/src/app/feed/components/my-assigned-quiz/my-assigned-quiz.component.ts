import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TOPIC_QUIZ_ASSIGNED_TO_USER, AppNotificationMessage } from './../../../core/model/socket-consts';
import { NotificationService } from './../../../core/services/notification.service';
import { PagingStrategyFactory, MY_ASSIGNED_QUIZ_URL } from './../../../shared/factories/paging-strategy-factory';
import { AppUtil } from './../../../shared/util/app-util';
import * as _ from 'lodash';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { Quiz } from './../../../shared/models/quiz';
import { Component, OnInit } from '@angular/core';
import { StartLoadingIndicator } from './../../../shared/decorators/spinner-decorators';
import { Subscription } from 'rxjs';

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
    public authService: AuthenticationService) {
  }

  @StartLoadingIndicator
  async ngOnInit() {
    this.pagingStrategy = await this.pagingStrategyFactory.createCustomUrlStrategy(MY_ASSIGNED_QUIZ_URL);
    this.subscriptions.push(
      this.notificationService.onMessage(TOPIC_QUIZ_ASSIGNED_TO_USER)
        .subscribe((message: AppNotificationMessage) => {
          this.handleQuizListUpdate(message);
        })
    );

    this.currentUserId = (await this.authService.getCurrentUser()).id;
  }

  handleQuizListUpdate(message: AppNotificationMessage): void {
    if (!message || !message.content) {
      return;
    }

    const quiz: Quiz = JSON.parse(message.content);
    if (quiz.isPublic) {
      throw new Error(
        `Cannot handle notification from topic ${message.topic}, public quiz cannot be assigned to user`);
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
