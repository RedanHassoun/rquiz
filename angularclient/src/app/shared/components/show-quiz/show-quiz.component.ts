import { AppNotificationMessage } from './../../../core/model/socket-consts';
import { NotificationService } from './../../../core/services/notification.service';
import { QuizAnswer } from '../../models/quiz-answer';
import { AppUtil } from '../../util/app-util';
import { Quiz } from '../../models/quiz';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { QuizService } from '../../../feed/services/quiz.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { User } from '../../models/user';
import { TOPIC_QUIZ_ANSWERS_UPDATE } from 'src/app/core/model/socket-consts';

@Component({
  selector: 'app-show-quiz',
  templateUrl: './show-quiz.component.html',
  styleUrls: ['./show-quiz.component.scss']
})
export class ShowQuizComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  selectedAnswerId: string;
  isAlreadyAnswered: boolean;
  currentUser: User;

  constructor(@Inject(MAT_DIALOG_DATA) public quiz: Quiz,
    private quizService: QuizService,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<ShowQuizComponent>,
    private notificationService: NotificationService) { }

  async ngOnInit() {
    this.currentUser = await this.authenticationService.getCurrentUser();
    this.checkIfQuizAlreadyAnswered();
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

  async checkIfQuizAlreadyAnswered(): Promise<void> {
    this.isAlreadyAnswered = await this.quizService.isAlreadyAnswered(this.quiz, this.currentUser.id);
  }

  shouldHideSolveButton(): boolean {
    if (typeof this.isAlreadyAnswered === 'undefined' || this.isAlreadyAnswered === null) {
      return true;
    }

    if (!!this.isAlreadyAnswered ||
      (!this.currentUser || this.currentUser.id === this.quiz.creator.id)) {
      return true;
    }

    return false;
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

    this.quizService.solve(this.quiz.id, answer)
      .subscribe(solvedQuiz => {
        const solvedQuizNotification = new AppNotificationMessage(solvedQuiz,
          TOPIC_QUIZ_ANSWERS_UPDATE,
          this.currentUser.id,
          this.currentUser.username);

        solvedQuizNotification.targetUserId = this.quiz.creator.id;

        this.notificationService.send(solvedQuizNotification);
        this.dialogRef.close();
      }, err => {
        AppUtil.showError(err.toString());
      });
  }
}
