import { AppUtil } from './../../../shared/util/app-util';
import { UserService } from './../../../core/services/user-service.service';
import { Quiz } from './../../../shared/models/quiz';
import { CustomUrlFetchingStrategy } from './../../../core/strategies/custom-url-fetching-strategy';
import { PagingDataFetchStrategy } from './../../../core/strategies/paging-data-fetch-strategy';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { NavigationHelperService } from './../../../shared/services/navigation-helper.service';
import { QuizService } from './../../services/quiz.service';
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

  constructor(private userService: UserService,
              private navigationService: NavigationHelperService,
              private authService: AuthenticationService) {
  }

  @StartLoadingIndicator
  async ngOnInit() {
    this.currentUserId = (await this.authService.getCurrentUser()).id;
    const urlForFetchingQuizList = `${this.currentUserId}/quiz`;
    this.pagingStrategy = new CustomUrlFetchingStrategy(this.userService,
      urlForFetchingQuizList,
      QuizService.PAGE_SIZE);
  }

  quizListChanged(newQuizList: Quiz[]) {
    if (this.quizList && this.quizList.length === 0) {
      AppUtil.triggerLoadingIndicatorStop();
    }
    this.quizList = _.concat(this.quizList, newQuizList);
  }
}
