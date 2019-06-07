import { tap, take } from 'rxjs/operators';
import { QuizService } from './../../../feed/services/quiz.service';
import { ClientDataServiceService } from './../../../shared/services/client-data-service.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-pageable',
  templateUrl: './pageable.component.html',
  styleUrls: ['./pageable.component.scss']
})
export class PageableComponent implements OnInit {
  dataList$ = new BehaviorSubject([]);
  finished = false;
  page = 0;

  constructor(private dataService: ClientDataServiceService,
              private paramMap: Map<string, string>) {
  }

  ngOnInit() {
    this.fetchItemsList(this.page);
  }

  onScroll() {
    if (!this.finished) {
      this.fetchItemsList(this.page);
    }
  }

  fetchItemsList(page: number) {
    if (page == null || typeof page === undefined) {
      return;
    }

    if (this.finished) {
      return;
    }

    this.dataService.getAllByParameter(this.paramMap, page, QuizService.PAGE_SIZE)
      .pipe(tap(res => {

        const newQuizItems = _.slice(res, 0, QuizService.PAGE_SIZE);
        const currentQuizList = this.dataList$.getValue();

        if (newQuizItems.length < QuizService.PAGE_SIZE) {
          this.finished = true;
        }

        if (newQuizItems.length > 0) {
          const combinedList = _.concat(currentQuizList, newQuizItems);
          this.dataList$.next(combinedList);
        }

        this.page++;
      }))
      .pipe(take(1))
      .subscribe();
  }
}
