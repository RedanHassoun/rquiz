import { PageableComponent } from './../../../core/components/pageable/pageable.component';
import { ShowQuizComponent } from './../show-quiz/show-quiz.component';
import { AppUtil } from './../../../shared/util/app-util';
import { CreateQuizComponent } from '../../../shared/components/create-quiz/create-quiz.component';
import { NavigationHelperService } from './../../../shared/services/navigation-helper.service';
import { Quiz } from './../../../shared/models/quiz';
import { QuizService } from './../../services/quiz.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent extends PageableComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(private quizService: QuizService,
              private navigationService: NavigationHelperService) {
    super(quizService,
          new Map<string, string>([ ['isPublic', 'true'] ]),
          QuizService.PAGE_SIZE);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  openCreateQuizDialog() {
    this.subscriptions.push(
      this.navigationService.openDialog(CreateQuizComponent).subscribe()
    );
  }

  showQuiz(quizId: string) {
    this.subscriptions.push(
      this.navigationService.openDialog(ShowQuizComponent, undefined, quizId)
          .subscribe()
    );
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
