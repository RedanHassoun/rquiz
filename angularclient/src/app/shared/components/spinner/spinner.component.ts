import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isLoading$ } from '../../decorators/spinner-decorators';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  @Input() loadingText = 'Please wait...';

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    isLoading$.subscribe((isLoading: boolean) => {
      if (!!isLoading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    }, err => {
      this.spinner.hide();
    });
  }
}
