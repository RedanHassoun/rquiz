import { ConfirmationDialogComponent } from './../components/confirmation-dialog/confirmation-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NavigationHelperService {

  constructor(public dialog: MatDialog) { }

  openYesNoDialog(message: string,
    yesResultCallback: (arg0?: any) => void,
    customWidthPX?: number) {
    let width = '350px';

    if (customWidthPX) {
      width = `${customWidthPX}px`;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: width,
      data: message
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        yesResultCallback();
      }
    });

    return dialogRef;
  }


  openYesNoDialogNoCallback(message: string,
    customWidthPX?: number) {
    let width = '350px';

    if (customWidthPX) {
      width = `${customWidthPX}px`;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: width,
      data: message
    });

    return dialogRef.afterClosed();
  }
}
