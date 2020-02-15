import { AppUtil } from './../../util/app-util';
import { Subscription } from 'rxjs';
import { SearchService } from './../../services/search.service';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged  } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() searchPlaceHolder = 'Search';
  @Output() searchQueryChanged = new EventEmitter();
  private subscriptions: Subscription[] = [];
  queryField: FormControl = new FormControl();

  constructor(searchService: SearchService) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.queryField.valueChanges
      .pipe(debounceTime(800), distinctUntilChanged())
        .subscribe(queryText => this.searchQueryChanged.emit(queryText))
    );
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

}
