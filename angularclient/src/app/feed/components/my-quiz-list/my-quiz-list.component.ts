import { AppNotificationMessage } from './../../../shared/index';
import { CreateQuizComponent } from './../create-quiz/create-quiz.component';
import { NavigationHelperService } from './../../../shared/services/navigation-helper.service';
import { AppConsts } from './../../../shared/util/app-consts';
import { QuizCrudService } from './../../services/quiz-crud.service';
import { filter } from 'rxjs/operators';
import { SocketTopics } from '../../../shared/util';
import { NotificationService } from './../../../core/services/notification.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { MY_QUIZ_URL } from './../../../shared/factories/paging-strategy-factory';
import { PagingStrategyFactory } from 'src/app/shared/factories/paging-strategy-factory';
import { AppUtil } from './../../../shared/util/app-util';
import { Quiz } from './../../../shared/models/quiz';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { StartLoadingIndicator } from './../../../shared/decorators/spinner-decorators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-quiz-list',
  templateUrl: './my-quiz-list.component.html',
  styleUrls: ['./my-quiz-list.component.scss']
})
export class MyQuizListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public quizList: Quiz[] = [];
  public currentUserId: string;
  public pagingStrategy: PagingDataFetchStrategy;
  appConsts: any = AppConsts; // TODO: make this more elegant

  constructor(private pagingStrategyFactory: PagingStrategyFactory,
    private navigationService: NavigationHelperService,
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
      this.notificationService.onMessage(SocketTopics.TOPIC_QUIZ_LIST_UPDATE)
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

    this.subscriptions.push(
      this.notificationService.onMessage(SocketTopics.TOPIC_QUIZ_ASSIGNED_TO_USER)
        .pipe(filter((message: AppNotificationMessage) => {
          try {
            const quiz: Quiz = JSON.parse(message.content);
            Object.setPrototypeOf(quiz, Quiz.prototype);
            return quiz.isCreatedByUser(this.currentUserId);
          } catch (ex) {
            return false;
          }
        }))
        .subscribe((message: AppNotificationMessage) => {
          this.quizCrudService.handleAddedQuiz(message, this.quizList);
        })
    );

    this.subscriptions.push(
      this.notificationService.onMessage(SocketTopics.TOPIC_QUIZ_ANSWERS_UPDATE)
        .subscribe((message: AppNotificationMessage) => {
          this.quizCrudService.handleQuizAnswersUpdate(message, this.quizList);
        })
    );

    this.subscriptions.push(
      this.notificationService.onMessage(SocketTopics.TOPIC_QUIZ_DELETED_UPDATE)
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
    return this.appConsts.MY_QUIZ_LIST_DISPLAY;
  }

  openCreateQuizDialog() {
    if (this.navigationService.isMobileMode()) {
      this.subscriptions.push(
        this.navigationService.openDialog(CreateQuizComponent, '100vw', null, true).subscribe()
      );
    } else {
      this.subscriptions.push(
        this.navigationService.openDialog(CreateQuizComponent).subscribe()
      );
    }

  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
