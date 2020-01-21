import { PagingStrategyFactory, MY_ASSIGNED_QUIZ_URL } from './../../../shared/factories/paging-strategy-factory';
import { AppUtil } from './../../../shared/util/app-util';
import * as _ from 'lodash';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { Quiz } from './../../../shared/models/quiz';
import { Component, OnInit } from '@angular/core';
import { StartLoadingIndicator } from './../../../shared/decorators/spinner-decorators';

@Component({
  selector: 'app-my-assigned-quiz',
  templateUrl: './my-assigned-quiz.component.html',
  styleUrls: ['./my-assigned-quiz.component.scss']
})
export class MyAssignedQuizComponent implements OnInit {
  public quizList: Quiz[] = [];
  public pagingStrategy: PagingDataFetchStrategy;

  constructor(private pagingStrategyFactory: PagingStrategyFactory) {
  }

  @StartLoadingIndicator // TODO: handle failure
  ngOnInit() {
    this.pagingStrategy = this.pagingStrategyFactory.createCustomUrlStrategy(MY_ASSIGNED_QUIZ_URL);
  }

  quizListChanged(newQuizList: Quiz[]) {
    if (this.quizList && this.quizList.length === 0) {
      AppUtil.triggerLoadingIndicatorStop();
    }
    this.quizList = _.concat(this.quizList, newQuizList);
  }
}
