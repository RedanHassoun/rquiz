import { PageableComponent } from './../../../core/components/pageable/pageable.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-quiz-list',
  templateUrl: './my-quiz-list.component.html',
  styleUrls: ['./my-quiz-list.component.scss']
})
export class MyQuizListComponent extends PageableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
