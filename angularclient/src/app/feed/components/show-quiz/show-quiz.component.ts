import { QuizAnswer } from './../../../shared/models/quiz-answer';
import { AppUtil } from './../../../shared/util/app-util';
import { Quiz } from './../../../shared/models/quiz';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { QuizService } from '../../services/quiz.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-quiz',
  templateUrl: './show-quiz.component.html',
  styleUrls: ['./show-quiz.component.scss']
})
export class ShowQuizComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  quiz: Quiz;
  selectedAnswerId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public quizId: string,
    private quizService: QuizService,
    private dialogRef: MatDialogRef<ShowQuizComponent>) { }

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

  async solve(): Promise<void> {
    if (!this.selectedAnswerId) {
      AppUtil.handleNullError('The selected answer ID');
    }

    const answer: QuizAnswer = this.quiz.answers
      .find(q => q.id === this.selectedAnswerId);

    if (!answer) {
      throw new Error('The selected answer is undefined');
    }
    console.log('answer: ', JSON.stringify(answer));

    this.quizService.solve(this.quiz.id, answer)
      .subscribe(res => {
        this.dialogRef.close();
      }, err => {
        AppUtil.showError(err.toString());
      });
  }
}
