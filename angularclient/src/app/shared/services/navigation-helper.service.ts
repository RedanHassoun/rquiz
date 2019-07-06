import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from './../components/confirmation-dialog/confirmation-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class NavigationHelperService {

  constructor(public dialog: MatDialog) { }

  public openYesNoDialog(message: string,
    yesResultCallback: (arg0?: any) => void,
    customWidthPX?: number): MatDialogRef<ConfirmationDialogComponent, any> {
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


  public openYesNoDialogNoCallback(message: string,
    customWidthPX?: number): Observable<any> {
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

  openDialog(dialog: ComponentType<{}>, width?: number, dialogData?: any) {
    let dialogWidth = '450px';
    if (width) {
      dialogWidth = `${width}px`;
    }
    const dialogRef = this.dialog.open(dialog, {
      width: dialogWidth,
      data: dialogData
    });

    return dialogRef.afterClosed();
  }
}
