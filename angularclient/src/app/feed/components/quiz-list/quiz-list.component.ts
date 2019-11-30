import { AuthenticationService } from './../../../core/services/authentication.service';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { AppUtil } from './../../../shared/util/app-util';
import { CreateQuizComponent } from '../../../shared/components/create-quiz/create-quiz.component';
import { NavigationHelperService } from './../../../shared/services/navigation-helper.service';
import { Quiz } from './../../../shared/models/quiz';
import { QuizService } from './../../services/quiz.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ParameterFetchingStrategy } from 'src/app/core/strategies/parameter-fetching-strategy';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AppNotificationMessage, TOPIC_QUIZ_LIST_UPDATE,
  TOPIC_QUIZ_ANSWERS_UPDATE, TOPIC_QUIZ_DELETED_UPDATE
} from './../../../core/model/socket-consts';
import { NotificationService } from './../../../core/services/notification.service';

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

  constructor(private quizService: QuizService,
    private navigationService: NavigationHelperService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService,
    private authService: AuthenticationService) {
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

  async ngOnInit() {
    this.currentUserId = (await this.authService.getCurrentUser()).id;
    this.pagingStrategy = new ParameterFetchingStrategy(this.quizService,
      new Map<string, string>([['isPublic', 'true']]),
      QuizService.PAGE_SIZE);

    this.subscriptions.push(
      this.notificationService.onMessage(TOPIC_QUIZ_LIST_UPDATE)
        .subscribe((message: AppNotificationMessage) => {
          this.handleQuizListUpdate(message);
        })
    );

    this.subscriptions.push(
      this.notificationService.onMessage(TOPIC_QUIZ_ANSWERS_UPDATE)
        .subscribe((message: AppNotificationMessage) => {
          this.handleQuizAnswersUpdate(message);
        })
    );

    this.subscriptions.push(
      this.notificationService.onMessage(TOPIC_QUIZ_DELETED_UPDATE)
        .subscribe((message: AppNotificationMessage) => {
          this.handleQuizDeletedUpdate(message);
        })
    );
  }

  private handleQuizDeletedUpdate(message: AppNotificationMessage): void {
    const id: string = JSON.parse(message.content).id;
    this.quizList = AppUtil.removeById(this.quizList, id);
  }

  private handleQuizListUpdate(message: AppNotificationMessage): void {
    if (!message || !message.content) {
      return;
    }
    const quiz: Quiz = JSON.parse(message.content);
    this.quizList.unshift(quiz);
  }

  private handleQuizAnswersUpdate(message: AppNotificationMessage): void {
    if (!message || !message.content) {
      return;
    }

    const quiz: Quiz = JSON.parse(message.content);
    const indexOfQuiz = this.quizList.findIndex(currQuiz => currQuiz.id === quiz.id);

    if (indexOfQuiz !== -1) {
      this.quizList[indexOfQuiz] = quiz;
    }
  }

  openCreateQuizDialog() {
    this.subscriptions.push(
      this.navigationService.openDialog(CreateQuizComponent).subscribe()
    );
  }

  quizListChanged(newQuizList: Quiz[]) {
    this.quizList = _.concat(this.quizList, newQuizList);
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
