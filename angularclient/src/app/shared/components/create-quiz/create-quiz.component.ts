import { FileUploadService } from './../../../core/services/file-upload.service';
import { take, switchMap } from 'rxjs/operators';
import { AlreadyExistError } from './../../app-errors/already-exist-error';
import { AppNotificationMessage, TOPIC_QUIZ_LIST_UPDATE } from './../../../core/model/socket-consts';
import { NotificationService } from './../../../core/services/notification.service';
import { UserService } from './../../../core/services/user-service.service';
import { User } from './../../models/user';
import { AppUtil } from './../../util/app-util';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { QuizService } from './../../../feed/services/quiz.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Quiz } from '../../models/quiz';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { QuizAnswer } from '../../models/quiz-answer';
import { Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as _ from 'lodash';
import { FormInputComponent } from './../form-input/form-input.component';
import { StartLoadingIndicator, StopLoadingIndicator } from './../../decorators/spinner-decorators';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent extends FormInputComponent implements OnInit, OnDestroy {
  @ViewChild('answerInput') answerInput: ElementRef;
  private subscriptions: Subscription[] = [];
  dropdownSettings: IDropdownSettings;
  quiz: Quiz;
  addQuizForm: FormGroup;
  users: User[];
  selectedUsers: User[] = [];
  currentUser: User;
  attachAnImage = false;
  imageToUpload: File = null;

  constructor(private quizService: QuizService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateQuizComponent>,
    private userService: UserService,
    private notificationService: NotificationService,
    private fileUploadService: FileUploadService) {
    super();
  }

  @StartLoadingIndicator
  async ngOnInit() {
    this.quiz = new Quiz();
    this.quiz.reset();
    this.addQuizForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.currentUser = await this.authenticationService.getCurrentUser();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'username',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    // TODO: Handle this request properly - improve performance
    this.subscriptions.push(
      this.userService.getAll()
        .subscribe((users: any[]) => {
          AppUtil.triggerLoadingIndicatorStop();
          this.users = AppUtil.removeById(users, this.currentUser.id);
        }, err => AppUtil.triggerLoadingIndicatorStop())
    );
  }

  get title() { return this.addQuizForm.controls.title; }
  get description() { return this.addQuizForm.controls.description; }


  addAnswer(answerContent: string): void {
    if (!answerContent) {
      return;
    }
    const answer = new QuizAnswer();
    answer.content = answerContent;
    answer.isCorrect = false;

    try {
      this.quiz.addAnswer(answer);
    } catch (ex) {
      if (ex instanceof AlreadyExistError) {
        AppUtil.showError(ex);
      } else {
        throw ex;
      }
    } finally {
      this.answerInput.nativeElement.value = '';
    }
  }

  publicChanged(isPublic: boolean): void {
    this.quiz.isPublic = isPublic;
  }

  attachAnImageChanged(attachAnImage: boolean): void {
    this.attachAnImage = attachAnImage;
    if (attachAnImage === false) {
      this.imageToUpload = null;
    }
  }

  public handleSelectedImage(files: FileList) {
    this.imageToUpload = files.item(0);
  }

  async addQuiz(): Promise<void> {
    if (this.quiz.answers.length < 2) {
      AppUtil.showWarningMessage('The quiz should have at least two answers');
      return;
    }

    const hasCorrectAnswer: boolean = await this.quizService.hasCorrectAnswer(this.quiz);
    if (!hasCorrectAnswer) {
      AppUtil.showWarningMessage('You must choose a correct answer');
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
          return this.quizService.create(this.quiz)
            .pipe(take(1));
        }))
        .subscribe((result: Quiz) => this.handleSuccessResult(result),
          (err: Error) => this.handleErrorResult(err))
    );
  }

  @StopLoadingIndicator
  private handleSuccessResult(result: Quiz): void {
    const addedQuiz = new AppNotificationMessage(result, TOPIC_QUIZ_LIST_UPDATE);
    this.notificationService.send(addedQuiz);
    this.dialogRef.close();
  }

  @StopLoadingIndicator
  private handleErrorResult(error: Error): void {
    AppUtil.showError(error);
  }

  setCorrect(answer: QuizAnswer): void {
    for (const ans of this.quiz.answers) {
      if (ans.content === answer.content) {
        ans.isCorrect = true;
      } else {
        ans.isCorrect = false;
      }
    }
  }

  deleteAnswer(answer: QuizAnswer): void {
    this.quiz.answers = _.remove(this.quiz.answers, (quizAnswer) => {
      return quizAnswer.content !== answer.content;
    });
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
