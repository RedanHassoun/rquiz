import { AppUtil } from './../../../shared/util/app-util';
import { Quiz } from './../../../shared/models/quiz';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { QuizService } from '../../services/quiz.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-quiz',
  templateUrl: './show-quiz.component.html',
  styleUrls: ['./show-quiz.component.scss']
})
export class ShowQuizComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  quiz: Quiz;

  constructor(@Inject(MAT_DIALOG_DATA) public quizId: string,
    private quizService: QuizService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.quizService.get(this.quizId)
        .subscribe((res: Quiz) => {
          this.quiz = res;
        }, (err) => {
          AppUtil.showError(err);
        })
    );
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
