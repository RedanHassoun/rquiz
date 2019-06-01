import { Quiz } from './../../../shared/models/quiz';
import { QuizService } from './../../services/quiz.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {
  quizList$ = new BehaviorSubject([]);
  finished = false;
  page = 0;

  constructor(private quizService: QuizService) {
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
        // update quiz list
        const newQuizItems = _.slice(res, 0, QuizService.PAGE_SIZE);

        const currentQuizList = this.quizList$.getValue();
        const combinedList = _.concat(currentQuizList, newQuizItems);

        // Houase keeping
        if (newQuizItems.length < QuizService.PAGE_SIZE) {
          this.finished = true;
        }
        this.page++;

        this.quizList$.next(combinedList);
      }))
      .pipe(take(1))
      .subscribe();
  }
}
