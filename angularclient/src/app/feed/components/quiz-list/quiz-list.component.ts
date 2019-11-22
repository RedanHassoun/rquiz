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
import { AppConsts } from 'src/app/shared/util';
import { AppNotificationMessage } from './../../../core/model/socket-consts';
import { NotificationService } from './../../../core/services/notification.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public quizList: Quiz[] = [];
  pagingStrategy: PagingDataFetchStrategy;

  constructor(private quizService: QuizService,
    private navigationService: NavigationHelperService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService) {
    this.iconRegistry.addSvgIcon( // TODO: make more general
      'done',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-done-24px.svg'));

    this.iconRegistry.addSvgIcon( // TODO: make more general
      'clear',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-clear-24px.svg'));
  }

  ngOnInit() {
    this.pagingStrategy = new ParameterFetchingStrategy(this.quizService,
      new Map<string, string>([['isPublic', 'true']]),
      QuizService.PAGE_SIZE);

    this.subscriptions.push(
      this.notificationService.onMessage(AppConsts.TOPIC_QUIZ_LIST_UPDATE)
        .subscribe((message: AppNotificationMessage) => {
          if (message && message.content) {
            const quiz: Quiz = JSON.parse(message.content);
            this.quizList.unshift(quiz);
          }
        })
    );
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
