import { AppUtil } from './../../../shared/util/app-util';
import * as _ from 'lodash';
import { QuizService } from './../../services/quiz.service';
import { CustomUrlFetchingStrategy } from './../../../core/strategies/custom-url-fetching-strategy';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { NavigationHelperService } from './../../../shared/services/navigation-helper.service';
import { UserService } from './../../../core/services/user-service.service';
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
  public currentUserId: string;
  public pagingStrategy: PagingDataFetchStrategy;

  constructor(private userService: UserService,
    private navigationService: NavigationHelperService,
    private authService: AuthenticationService) {
  }

  @StartLoadingIndicator // TODO: handle failure
  async ngOnInit() {
    this.currentUserId = (await this.authService.getCurrentUser()).id;
    const urlForFetchingQuizList = `${this.currentUserId}/assignedQuiz`;
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
