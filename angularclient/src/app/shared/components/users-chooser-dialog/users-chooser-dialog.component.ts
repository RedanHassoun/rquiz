import { User } from './../../models/user';
import { UsersChooserComponent } from './../users-chooser/users-chooser.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-users-chooser-dialog',
  templateUrl: './users-chooser-dialog.component.html',
  styleUrls: ['./users-chooser-dialog.component.scss']
})
export class UsersChooserDialogComponent implements OnInit {
  private selectedUsers: User[] = [];
  private title: string;

  constructor(@Inject(MAT_DIALOG_DATA) public usersChooserParams: any,
    private dialogRef: MatDialogRef<UsersChooserComponent>) {
      this.selectedUsers = usersChooserParams.selectedUsers;
      this.title = usersChooserParams.title;
    }

  ngOnInit() {
  }

  public handleOkClick(): void {
    this.dialogRef.close(this.selectedUsers);
  }

  public handleSelectionChange(usersList: User[]): void {
    this.selectedUsers = usersList;
  }
}
