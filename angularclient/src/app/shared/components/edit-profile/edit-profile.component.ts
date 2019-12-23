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
    private dialogRef: MatDialogRef<EditProfileComponent>) {
    super();
  }

  ngOnInit() {
    this.editProfileForm = this.formBuilder.group({
      about: [this.user.about, Validators.min(3)]
    });
  }

  editProfile(profileDetails: any): void {
    profileDetails.id = this.user.id;
    this.subscriptions.push(
      this.userService.update(this.user.id, profileDetails)
        .subscribe(result => {
            console.log('res:', result)
            this.dialogRef.close();
        }, err => {
            console.error('err', err)
        })
    );
  }

  get form(): { [key: string]: AbstractControl } {
    return this.editProfileForm.controls;
  }
}
