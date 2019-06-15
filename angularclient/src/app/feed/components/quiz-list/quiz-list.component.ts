import { AppUtil } from './../../../shared/util/app-util';
import { CreateQuizComponent } from '../../../shared/components/create-quiz/create-quiz.component';
import { NavigationHelperService } from './../../../shared/services/navigation-helper.service';
import { Quiz } from './../../../shared/models/quiz';
import { QuizService } from './../../services/quiz.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit, OnDestroy {
  quizList$ = new BehaviorSubject([]);
  finished = false;
  page = 0;
  private subscriptions: Subscription[] = [];

  constructor(private quizService: QuizService,
    private navigationService: NavigationHelperService) {
  }

  ngOnInit() {
    this.fetchQuizList(this.page);
  }

  onScroll() {
    if (!this.finished) {
      this.fetchQuizList(this.page);
    }
  }

  fetchQuizList(page: number) {
    if (page == null || typeof page === undefined) {
      return;
    }

    if (this.finished) {
      return;
    }

    this.quizService.getAllByPublic(true, page)
      .pipe(tap(res => {

        const newQuizItems = _.slice(res, 0, QuizService.PAGE_SIZE);
        const currentQuizList = this.quizList$.getValue();

        if (newQuizItems.length < QuizService.PAGE_SIZE) {
          this.finished = true;
        }

        if (newQuizItems.length > 0) {
          const combinedList = _.concat(currentQuizList, newQuizItems);
          this.quizList$.next(combinedList);
        }

        this.page++;
      }))
      .pipe(take(1))
      .subscribe();
  }

  openDiagg() {
    this.subscriptions.push(
      this.navigationService.openDialog(CreateQuizComponent).subscribe()
    );
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
