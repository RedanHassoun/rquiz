import { AppUtil } from '../../util/app-util';
import { UserAnswer } from 'src/app/shared/models/user-answer';
import { USER_ANSWERS_FOR_QUIZ } from '../../factories/paging-strategy-factory';
import { PagingStrategyFactory } from 'src/app/shared/factories/paging-strategy-factory';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Quiz } from '../../models/quiz';
import { PagingDataFetchStrategy } from '../../../core/strategies/paging-data-fetch-strategy';
import { Subscription } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import { TimeAgo } from 'javascript-time-ago';

@Component({
  selector: 'app-user-answers-list',
  templateUrl: './user-answers-list.component.html',
  styleUrls: ['./user-answers-list.component.scss']
})
export class UserAnswersListComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  userAnswersList: UserAnswer[] = [];
  pagingStrategy: PagingDataFetchStrategy;

  constructor(@Inject(MAT_DIALOG_DATA) public quiz: Quiz,
    private pagingStrategyFactory: PagingStrategyFactory) { }

  async ngOnInit(): Promise<void> {
    this.pagingStrategy = await this.pagingStrategyFactory.createCustomUrlStrategy(
      USER_ANSWERS_FOR_QUIZ, new Map<string, string>([['quizId', this.quiz.id]]));
  }

  userAnswerListChanged(newQuizList: UserAnswer[]) {
    if (this.userAnswersList && this.userAnswersList.length === 0) {
      AppUtil.triggerLoadingIndicatorStop();
    }

    this.userAnswersList = _.concat(this.userAnswersList, newQuizList);
  }

  getQuizAnswer(id: string): string {
    return this.quiz.getAnswerById(id);
  }

  shouldShowList(): boolean {
    return this.userAnswersList && this.userAnswersList.length > 0;
  }

  getTimeAgo(userAnswer: UserAnswer): string {
    return AppUtil.getTimeAgo(userAnswer);
  }
}
