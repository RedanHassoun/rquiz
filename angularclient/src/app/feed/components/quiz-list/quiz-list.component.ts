import { PageableComponent } from './../../../core/components/pageable/pageable.component';
import { QuizService } from './../../services/quiz.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent extends PageableComponent implements OnInit {

  constructor(private quizService: QuizService) {
    super(quizService,
          new Map<string, string>([ ['isPublic', 'true'] ]),
          QuizService.PAGE_SIZE);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
