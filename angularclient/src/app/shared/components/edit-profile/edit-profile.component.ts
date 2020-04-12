import { WebSocketService } from './../../services/web-socket.service';
import { AppNotificationMessage } from './../../models/app-notification-message';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { FileUploadService } from './../../../core/services/file-upload.service';
import { UpdateUserRequest } from './../../models/update-user-request';
import { SocketTopics } from '../../util';
import { AppUtil } from './../../util/app-util';
import { UserService } from './../../../core/services/user-service.service';
import { User } from './../../models/user';
import { FormInputComponent } from './../form-input/form-input.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StartLoadingIndicator, StopLoadingIndicator } from '../../decorators/spinner-decorators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent extends FormInputComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  editProfileForm: FormGroup;
  imageToUpload: File = null;
  uploadedImageUrl = null;

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private user: User,
    private userService: UserService,
    private dialogRef: MatDialogRef<EditProfileComponent>,
    private fileUploadService: FileUploadService,
    private webSocketService: WebSocketService) {
    super();
  }

  ngOnInit() {
    this.uploadedImageUrl = this.user.imageUrl;
    this.editProfileForm = this.formBuilder.group({
      about: [this.user.about, Validators.min(3)],
      image: ['', null]
    });
  }

  @StartLoadingIndicator
  editProfile(profileDetails: UpdateUserRequest): void {
    profileDetails.id = this.user.id;

    this.subscriptions.push(
      this.fileUploadService.uploadImage(this.imageToUpload, this.user.imageUrl)
        .pipe(switchMap((imageUrl) => {
          this.uploadedImageUrl = imageUrl;
          profileDetails.imageUrl = imageUrl;
          return this.userService.update(this.user.id, profileDetails);
        }))
        .subscribe(() => this.handleUpdateProfileSuccess(),
                   (err: HttpErrorResponse) => this.handleUpdateProfileError(err))
    );
  }

  get form(): { [key: string]: AbstractControl } {
    return this.editProfileForm.controls;
  }

  public handleSelectedImage(files: FileList) {
    this.imageToUpload = files.item(0);
  }

  @StopLoadingIndicator
  private handleUpdateProfileSuccess() {
    const updatedUser = new AppNotificationMessage(this.user.id, SocketTopics.TOPIC_USER_UPDATE);
    this.webSocketService.send(updatedUser);
    this.dialogRef.close();
  }

  @StopLoadingIndicator
  private handleUpdateProfileError(error: HttpErrorResponse): void {
    if (this.uploadedImageUrl) {
      this.fileUploadService.delete(this.uploadedImageUrl).subscribe();
    }
    AppUtil.showError(error);
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
