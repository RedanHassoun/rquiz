import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor() { }

  ngOnInit() {
    this.quiz = new Quiz();
    this.temp();
    this.quiz.reset();
    this.addQuizForm = new FormGroup({
      'title': new FormControl(this.quiz.title, [
        Validators.required,
        Validators.minLength(4)
      ]),
      'description': new FormControl(this.quiz.description, [
        Validators.required,
        Validators.minLength(4)]),
      'newAnswer': new FormControl(this.quiz.description, [
        Validators.required,
        Validators.minLength(4)])
    });
  }

  temp() {
    const answer: QuizAnswer = new QuizAnswer();
    answer.id = 'aaa';
    answer.content = 'answer 1';
    answer.isCorrect = true;
    this.quiz.addAnswer(answer);
  }
  get title() { return this.quiz.title; }
  get description() { return this.quiz.description; }


  addQuiz() {
    console.log('adding ..');
    // this.peopleService.createPerson(this.newPerson)
    //   .subscribe((response) => {
    //     console.log('Create person response: ' + JSON.stringify(response))
    //     this.addToPeople(response.json())
    //     this.newPerson.reset()
    //   },
    //     (error) => {
    //       console.log('An error occurred: ' + error)
    //       this.newPerson.reset()
    //       alert('An error occurred while connecting to server')
    //     })
  }
}
