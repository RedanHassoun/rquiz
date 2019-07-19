import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { ShowQuizComponent } from './../show-quiz/show-quiz.component';
import { AppUtil } from './../../../shared/util/app-util';
import { CreateQuizComponent } from '../../../shared/components/create-quiz/create-quiz.component';
import { NavigationHelperService } from './../../../shared/services/navigation-helper.service';
import { Quiz } from './../../../shared/models/quiz';
import { QuizService } from './../../services/quiz.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ParameterFetchingStrategy } from 'src/app/core/strategies/parameter-fetching-strategy';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private quizList: Quiz[] = [];
  pagingStrategy: PagingDataFetchStrategy;

  constructor(private quizService: QuizService,
              private navigationService: NavigationHelperService) {
  }

  ngOnInit() {
    this.pagingStrategy = new ParameterFetchingStrategy(this.quizService,
      new Map<string, string>([['isPublic', 'true']]),
      QuizService.PAGE_SIZE);
  }

  openCreateQuizDialog() {
    this.subscriptions.push(
      this.navigationService.openDialog(CreateQuizComponent).subscribe()
    );
  }

  showQuiz(quizId: string): void {
    this.subscriptions.push(
      this.navigationService.openDialog(ShowQuizComponent, undefined, quizId)
        .subscribe()
    );
  }

  quizListChanged(newQuizList: Quiz[]) {
    this.quizList = _.concat(this.quizList, newQuizList);
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
