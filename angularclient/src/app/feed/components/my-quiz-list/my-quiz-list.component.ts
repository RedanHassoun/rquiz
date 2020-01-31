import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { MY_QUIZ_URL } from './../../../shared/factories/paging-strategy-factory';
import { PagingStrategyFactory } from 'src/app/shared/factories/paging-strategy-factory';
import { AppUtil } from './../../../shared/util/app-util';
import { Quiz } from './../../../shared/models/quiz';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { StartLoadingIndicator } from './../../../shared/decorators/spinner-decorators';

@Component({
  selector: 'app-my-quiz-list',
  templateUrl: './my-quiz-list.component.html',
  styleUrls: ['./my-quiz-list.component.scss']
})
export class MyQuizListComponent implements OnInit {

  public quizList: Quiz[] = [];
  public currentUserId: string;
  public pagingStrategy: PagingDataFetchStrategy;

  constructor(private pagingStrategyFactory: PagingStrategyFactory,
    private authService: AuthenticationService) {
  }

  @StartLoadingIndicator
  async ngOnInit() {
    this.pagingStrategy = await this.pagingStrategyFactory.createCustomUrlStrategy(MY_QUIZ_URL);
    this.currentUserId = (await this.authService.getCurrentUser()).id;
  }

  quizListChanged(newQuizList: Quiz[]) {
    if (this.quizList && this.quizList.length === 0) {
      AppUtil.triggerLoadingIndicatorStop();
    }
    this.quizList = _.concat(this.quizList, newQuizList);
  }
}
