import { WebSocketService } from './../../../shared/services/web-socket.service';
import { AppNotificationMessage } from './../../../shared/index';
import { AppUtil } from './../../../shared/util/app-util';
import { QuizCrudService } from './../../services/quiz-crud.service';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { take, switchMap } from 'rxjs/operators';
import { User } from '../../../shared/models/user';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { QuizService } from '../../services/quiz.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Quiz } from '../../../shared/models/quiz';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { QuizAnswer } from '../../../shared/models/quiz-answer';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { StartLoadingIndicator, StopLoadingIndicator } from '../../../shared/decorators/spinner-decorators';
import { SocketTopics } from './../../../shared/util';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent extends FormInputComponent implements OnInit, OnDestroy {
  @ViewChild('answerInput', { static: false }) answerInput: ElementRef;
  private subscriptions: Subscription[] = [];
  quiz: Quiz;
  addQuizForm: FormGroup;
  selectedUsers: User[] = [];
  currentUser: User;
  attachAnImage = false;
  imageToUpload: File = null;

  constructor(private quizService: QuizService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateQuizComponent>,
    private fileUploadService: FileUploadService,
    private quizCrudService: QuizCrudService,
    private webSocketService: WebSocketService) {
    super();
  }

  async ngOnInit() {
    this.dialogRef.disableClose = true;
    this.quiz = new Quiz();
    this.quiz.reset();
    this.addQuizForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', []]
    });

    this.currentUser = await this.authenticationService.getCurrentUser();
  }

  get title() { return this.addQuizForm.controls.title; }
  get description() { return this.addQuizForm.controls.description; }


  public addAnswer(answerContent: string): void {
    if (!answerContent) {
      return;
    }
    this.quizCrudService.addAnswer(this.quiz, answerContent, AppUtil.showError);
    this.answerInput.nativeElement.value = '';
  }

  public publicChanged(isPublic: boolean): void {
    this.quiz.isPublic = isPublic;
    if (isPublic === false) {
      this.selectedUsers = [];
    }
  }

  public attachAnImageChanged(attachAnImage: boolean): void {
    this.attachAnImage = attachAnImage;
    if (attachAnImage === false) {
      this.imageToUpload = null;
    }
  }

  public handleSelectedImage(files: FileList) {
    this.imageToUpload = files.item(0);
  }

  public addQuiz(): Promise<void> {
    if (this.quiz.answers.length < 2) {
      AppUtil.showWarningMessage('The quiz should have at least two answers');
      return;
    }

    if (!this.quiz.hasCorrectAnswer()) {
      AppUtil.showWarningMessage('Please choose a correct answer');
      return;
    }

    this.quiz.creator = { ...this.currentUser };
    this.quiz.assignedUsers = this.selectedUsers;
    this.sendTheQuizToServer();
  }

  @StartLoadingIndicator
  private sendTheQuizToServer(): void {
    this.subscriptions.push(
      this.fileUploadService.uploadImage(this.imageToUpload, null)
        .pipe(switchMap((imageUrl: string) => {
          this.quiz.imageUrl = imageUrl;
          return this.quizService.create(this.quiz).pipe(take(1));
        }))
        .subscribe((result: Quiz) => this.handleSuccessResult(result),
          (err: Error) => this.handleErrorResult(err))
    );
  }

  @StopLoadingIndicator
  private handleSuccessResult(addedQuiz: Quiz): void {
    let addedQuizNotification = null;
    if (addedQuiz && addedQuiz.isPublic) {
      addedQuizNotification = new AppNotificationMessage(addedQuiz, SocketTopics.TOPIC_QUIZ_LIST_UPDATE);
      this.webSocketService.send(addedQuizNotification);
    } else {
      for (const assignedUser of addedQuiz.assignedUsers) {
        addedQuizNotification = new AppNotificationMessage(addedQuiz,
          SocketTopics.TOPIC_QUIZ_ASSIGNED_TO_USER,
          this.currentUser.id,
          this.currentUser.username);
        addedQuizNotification.targetUserIds = [assignedUser.id];
        this.webSocketService.send(addedQuizNotification);
      }
    }
    this.dialogRef.close();
  }

  @StopLoadingIndicator
  private handleErrorResult(error: Error): void {
    AppUtil.showError(error);
  }

  public setCorrect(answer: QuizAnswer): void {
    this.quiz.setCorrectAnswer(answer);
  }

  public deleteAnswer(answer: QuizAnswer): void {
    this.quiz.deleteAnswer(answer);
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

  public updateSelectedUsers(users: User[]): void {
    this.selectedUsers = users;
  }

  public getUserSelectionButtonText(): string {
    if (!this.selectedUsers || this.selectedUsers.length === 0) {
      return 'Please select users to assign to';
    }

    if (this.selectedUsers.length === 1) {
      return 'One user selected';
    }

    return `${this.selectedUsers.length} users selected`;
  }
}
