import { UserService } from './../../../core/services/user-service.service';
import { User } from './../../models/user';
import { AppUtil } from './../../util/app-util';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { QuizService } from './../../../feed/services/quiz.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Quiz } from '../../models/quiz';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QuizAnswer } from '../../models/quiz-answer';
import { Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  dropdownSettings: IDropdownSettings;
  quiz: Quiz;
  addQuizForm: FormGroup;
  users: User[];
  selectedUsers: User[] = [];
  currentUserId: string;

  constructor(private quizService: QuizService,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<CreateQuizComponent>,
    private userService: UserService) { }

  async ngOnInit() {
    this.quiz = new Quiz();
    this.quiz.reset();
    this.addQuizForm = new FormGroup({
      'title': new FormControl(this.quiz.title, [
        Validators.required,
        Validators.minLength(4)
      ]),
      'description': new FormControl(this.quiz.description, [
        Validators.required,
        Validators.minLength(4)])
      //   ,
      // 'newAnswer': new FormControl(this.quiz.description, [
      //   Validators.required,
      //   Validators.minLength(4)])
    });

    this.currentUserId = (await this.authenticationService.getCurrentUser()).id;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'username',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.subscriptions.push(
      this.userService.getAll()
        .subscribe((users: any[]) => {
          this.users = AppUtil.removeById(users, this.currentUserId);
        })
    );
  }

  get title() { return this.quiz.title; }
  get description() { return this.quiz.description; }


  addAnswer(answerContent: string): void {
    if (!answerContent) {
      return;
    }
    const answer = new QuizAnswer();
    answer.content = answerContent;
    answer.isCorrect = false;
    this.quiz.addAnswer(answer);
  }

  publicChanged(isPublic: boolean): void {
    this.quiz.isPublic = isPublic;
  }

  async addQuiz(): Promise<void> {
    const hasCorrectAnswer: boolean = await this.quizService.hasCorrectAnswer(this.quiz);
    if (!hasCorrectAnswer) {
      alert('You must choose a correct answer');
      return;
    }

    this.quiz.creatorId = this.currentUserId;
    this.quiz.assignedUsers = this.selectedUsers;
    this.subscriptions.push(
      this.quizService.create(this.quiz)
        .subscribe(result => {
          this.dialogRef.close();
        }, (err) => {
          AppUtil.showError(err);
        })
    );
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

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
