import { AppUtil } from './../../util/app-util';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { QuizService } from './../../../feed/services/quiz.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Quiz } from '../../models/quiz';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QuizAnswer } from '../../models/quiz-answer';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {
  quiz: Quiz;
  addQuizForm: FormGroup;

  constructor(private quizService: QuizService,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<CreateQuizComponent>) { }

  ngOnInit() {
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
  }

  get title() { return this.quiz.title; }
  get description() { return this.quiz.description; }


  addAnswer(answerContent: string) {
    if (!answerContent) {
      return;
    }
    const ans = new QuizAnswer();
    ans.content = answerContent;
    ans.isCorrect = false;
    this.quiz.addAnswer(ans);
  }

  publicChanged(isPublic: boolean): void {
    this.quiz.isPublic = isPublic;
  }

  async addQuiz() {
    const hasCorrectAnswer: boolean = await this.quizService.hasCorrectAnswer(this.quiz);
    if (!hasCorrectAnswer) {
      alert('You must choose correct answer');
      return;
    }
    const currentUserId: string = (await this.authenticationService.getCurrentUser()).id;
    this.quiz.creatorId = currentUserId;

    this.quizService.create(this.quiz)
      .subscribe(res => {
        this.dialogRef.close();
      }, (err) => {
        AppUtil.showError(err);
      });
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
}
