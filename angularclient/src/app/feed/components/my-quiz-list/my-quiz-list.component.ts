import { AuthenticationService } from './../../../core/services/authentication.service';
import { CustomUrlFetchingStrategy } from './../../../core/strategies/custom-url-fetching-strategy';
import { NavigationHelperService } from './../../../shared/services/navigation-helper.service';
import { QuizService } from './../../services/quiz.service';
import { PageableComponent } from './../../../core/components/pageable/pageable.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-quiz-list',
  templateUrl: './my-quiz-list.component.html',
  styleUrls: ['./my-quiz-list.component.scss']
})
export class MyQuizListComponent extends PageableComponent implements OnInit {

  constructor(private quizService: QuizService,
              private navigationService: NavigationHelperService,
              private authService: AuthenticationService) {
    super(new CustomUrlFetchingStrategy(quizService, '', QuizService.PAGE_SIZE));
  }

  ngOnInit() {
  }

}
