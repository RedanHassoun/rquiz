import { AppUtil } from './../../util/app-util';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isLoading$ } from '../../decorators/spinner-decorators';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  @Input() loadingText = 'Please wait...';
  @Input() showCancel = false;
  @Output() cancelButtonClicked = new EventEmitter();

  private subscriptions: Subscription[] = [];

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.subscriptions.push(
      isLoading$.subscribe((isLoading: boolean) => {
        if (!!isLoading) {
          this.spinner.show();
        } else {
          this.spinner.hide();
        }
      }, err => {
        this.spinner.hide();
      })
    );
  }

  cancelClicked(): void {
    this.cancelButtonClicked.emit();
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
