import { Quiz } from './../../../shared/models/quiz';
import { QuizService } from './../../services/quiz.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {
  quizList: Quiz[] = [];

  constructor(private quizService: QuizService) {
  }

  ngOnInit() {
    this.quizService.getAllWithParam(true)
        .subscribe( (quizList: Quiz[]) => {
          this.quizList = quizList;
          console.table(this.quizList);
        });
  }
}
