import { UpdateUserRequest } from './../../models/update-user-request';
import { NotificationService } from './../../../core/services/notification.service';
import { AppNotificationMessage, TOPIC_USER_UPDATE } from './../../../core/model/socket-consts';
import { AppUtil } from './../../util/app-util';
import { UserService } from './../../../core/services/user-service.service';
import { User } from './../../models/user';
import { FormInputComponent } from './../form-input/form-input.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent extends FormInputComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  editProfileForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private user: User,
              private userService: UserService,
              private dialogRef: MatDialogRef<EditProfileComponent>,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.editProfileForm = this.formBuilder.group({
      about: [this.user.about, Validators.min(3)],
      imageUrl: [this.user.imageUrl, null]  // TODO : handle image upload
    });
  }

  editProfile(profileDetails: UpdateUserRequest): void {
    profileDetails.id = this.user.id;
    this.subscriptions.push(
      this.userService.update(this.user.id, profileDetails)
        .subscribe(() => {
          const updatedUser = new AppNotificationMessage(this.user.id);
          this.notificationService.send(TOPIC_USER_UPDATE, updatedUser);
          this.dialogRef.close();
        }, err => {
          AppUtil.showError(err);
        })
    );
  }

  get form(): { [key: string]: AbstractControl } {
    return this.editProfileForm.controls;
  }
}
