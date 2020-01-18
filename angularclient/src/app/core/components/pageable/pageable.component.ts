import { PagingDataFetchStrategy } from './../../strategies/paging-data-fetch-strategy';
import { tap, take } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-pageable',
  templateUrl: './pageable.component.html',
  styleUrls: ['./pageable.component.scss']
})
export class PageableComponent implements OnInit, OnChanges {
  @Input() public pagingStrategy: PagingDataFetchStrategy;
  @Output() public dataListChanged = new EventEmitter();
  totalItemsCount = 0;
  finished = false;
  page = 0;
  fetchingData = false;

  constructor() { }

  ngOnInit() {
    this.fetchItemsList(this.page);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.hasOwnProperty('pagingStrategy')) {
      return;
    }

    if (this.page === 0 && this.totalItemsCount === 0) {
      this.fetchItemsList(this.page);
    }
  }

  onScroll() {
    if (!this.finished) {
      this.fetchItemsList(this.page);
    }
  }

  fetchItemsList(page: number) {
    if (this.fetchingData) {
      return;
    }

    if (page == null || typeof page === undefined || !this.pagingStrategy) {
      return;
    }

    if (this.finished) {
      return;
    }
    this.fetchingData = true;

    this.pagingStrategy.dataObservable(page)
      .pipe(tap(res => {
        this.fetchingData = false;

        const newItems = _.slice(res, 0, this.pagingStrategy.getPageSize());

        if (newItems.length < this.pagingStrategy.getPageSize()) {
          this.finished = true;
        }

        this.totalItemsCount += newItems.length;
        this.dataListChanged.emit(newItems);

        this.page++;
      }))
      .pipe(take(1))
      .subscribe();
  }
}
