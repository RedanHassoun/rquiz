import { PagingDataFetchStrategy } from './../../strategies/paging-data-fetch-strategy';
import { tap, take } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-pageable',
  templateUrl: './pageable.component.html',
  styleUrls: ['./pageable.component.scss']
})
export class PageableComponent implements OnInit {
  @Input() public pagingStrategy: PagingDataFetchStrategy;
  @Output() public dataList = new EventEmitter();
  totalItemsCount = 0;
  finished = false;
  page = 0;

  constructor() {
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
    if (page == null || typeof page === undefined || !this.pagingStrategy) {
      return;
    }

    if (this.finished) {
      return;
    }

    this.pagingStrategy.dataObservable(page)
      .pipe(tap(res => {

        const newItems = _.slice(res, 0, this.pagingStrategy.getPageSize());

        if (newItems.length < this.pagingStrategy.getPageSize()) {
          this.finished = true;
        }

        if (newItems.length > 0) {
          this.totalItemsCount += newItems.length;
          this.dataList.emit(newItems);
        }

        this.page++;
      }))
      .pipe(take(1))
      .subscribe();
  }
}
