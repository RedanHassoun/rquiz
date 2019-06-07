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
              private paramMap: Map<string, string>,
              private pageSize: number) {
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

    this.dataService.getAllByParameter(this.paramMap, page, this.pageSize)
      .pipe(tap(res => {

        const newItems = _.slice(res, 0, this.pageSize);
        const currentItemsList = this.dataList$.getValue();

        if (newItems.length < this.pageSize) {
          this.finished = true;
        }

        if (newItems.length > 0) {
          const combinedList = _.concat(currentItemsList, newItems);
          this.dataList$.next(combinedList);
        }

        this.page++;
      }))
      .pipe(take(1))
      .subscribe();
  }
}
