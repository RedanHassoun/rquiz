import { WebSocketService } from './../../../shared/services/web-socket.service';
import { AppNotificationMessage } from './../../../shared/index';
import { filter } from 'rxjs/operators';
import { QuizCrudService } from './../../services/quiz-crud.service';
import { Service } from './../../../shared/factories/paging-strategy-factory';
import { PagingStrategyFactory } from 'src/app/shared/factories/paging-strategy-factory';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { AppUtil } from './../../../shared/util/app-util';
import { CreateQuizComponent } from '../create-quiz/create-quiz.component';
import { NavigationHelperService } from './../../../shared/services/navigation-helper.service';
import { Quiz } from './../../../shared/models/quiz';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SocketTopics } from '../../../shared/util';
import { UserNotificationsService } from '../../../core/services/user-notifications.service';
import { StartLoadingIndicator } from './../../../shared/decorators/spinner-decorators';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public quizList: Quiz[] = [];
  public currentUserId: string;
  pagingStrategy: PagingDataFetchStrategy;

  constructor(private navigationService: NavigationHelperService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private authService: AuthenticationService,
    private pagingStrategyFactory: PagingStrategyFactory,
    private quizCrudService: QuizCrudService,
    private webSocketService: WebSocketService) {
    this.iconRegistry.addSvgIcon( // TODO: make more general
      'done',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-done-24px.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'clear',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-clear-24px.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'delete',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/delete-24px.svg'));
  }

  @StartLoadingIndicator
  async ngOnInit() {
    this.currentUserId = (await this.authService.getCurrentUser()).id;
    this.pagingStrategy = await this.pagingStrategyFactory.createStrategyWithParams(
      Service.Quiz, new Map<string, string>([['isPublic', 'true']]));

    this.subscriptions.push(
      this.webSocketService.onMessage(SocketTopics.TOPIC_QUIZ_LIST_UPDATE)
        .pipe(filter((message: AppNotificationMessage) => {
          return this.quizCrudService.isPublicQuizMessage(message);
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

  openCreateQuizDialog() {
    if (this.navigationService.isMobileMode()) {
      this.subscriptions.push(
        this.navigationService.openDialog(CreateQuizComponent,
          this.navigationService.getMediumDialogWidth(),
          null,
          true).subscribe()
      );
    } else {
      this.subscriptions.push(
        this.navigationService.openDialog(CreateQuizComponent,
          this.navigationService.getMediumDialogWidth()).subscribe()
      );
    }

  }

  quizListChanged(newQuizList: Quiz[]) {
    if (this.quizList && this.quizList.length === 0) {
      AppUtil.triggerLoadingIndicatorStop();
    }

    this.quizList = _.concat(this.quizList, newQuizList);
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
