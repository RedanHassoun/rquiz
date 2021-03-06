import { WebSocketService } from './../../../shared/services/web-socket.service';
import { QuizCrudService } from './../../services/quiz-crud.service';
import { UserAnswersListComponent } from '../../../shared/components/user-answers-list/user-answers-list.component';
import { NavigationHelperService } from './../../../shared/services/navigation-helper.service';
import { AppUtil } from './../../../shared/util/app-util';
import { UserAnswer } from './../../../shared/models/user-answer';
import { SocketTopics } from '../../../shared/util';
import { QuizAnswer } from '../../../shared/models/quiz-answer';
import { Quiz } from '../../../shared/models/quiz';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { QuizService } from '../../services/quiz.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { User } from '../../../shared/models/user';
import { StopLoadingIndicator, StartLoadingIndicator } from '../../../shared/decorators/spinner-decorators';
import { AppNotificationMessage } from './../../../shared/index';

@Component({
  selector: 'app-show-quiz',
  templateUrl: './show-quiz.component.html',
  styleUrls: ['./show-quiz.component.scss']
})
export class ShowQuizComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  selectedAnswerId: string;
  currentUserAnswerForQuiz: UserAnswer;
  currentUser: User;

  constructor(@Inject(MAT_DIALOG_DATA) public quiz: Quiz,
    private quizService: QuizService,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<ShowQuizComponent>,
    private navigationService: NavigationHelperService,
    private quizCrudService: QuizCrudService,
    private webSocketService: WebSocketService) { }

  async ngOnInit() {
    this.currentUser = await this.authenticationService.getCurrentUser();
    this.currentUserAnswerForQuiz = await this.quizCrudService.getUserAnswerForQuiz(this.quiz, this.currentUser.id, true);
    if (this.currentUserAnswerForQuiz) {
      this.selectedAnswerId = this.currentUserAnswerForQuiz.answerId;
    }
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

  isAlreadyAnswered(): boolean {
    return AppUtil.hasValue(this.currentUserAnswerForQuiz);
  }

  shouldHideSolveButton(): boolean {
    if (!!this.isAlreadyAnswered() ||
      (!this.currentUser || this.currentUser.id === this.quiz.creator.id)) {
      return true;
    }

    return false;
  }

  getButtonText(): string {
    if (!!this.shouldHideSolveButton()) {
      return 'Show user answers';
    } else {
      return 'Solve!';
    }
  }

  handleQuizAction() {
    if (!!this.shouldHideSolveButton()) {
      this.showUserAnswers();
    } else {
      this.solve();
    }
  }

  showUserAnswers(): void {
    this.subscriptions.push(
      this.navigationService.openDialog(UserAnswersListComponent, undefined, this.quiz)
        .subscribe()
    );
  }

  solve(): void {
    if (!this.selectedAnswerId) {
      AppUtil.showErrorMessage('Please choose an answer');
    }

    const answer: QuizAnswer = this.quiz.answers
      .find(q => q.id === this.selectedAnswerId);

    if (!answer) {
      throw new Error('The selected answer is undefined');
    }

    this.sendSolutionToServer(this.quiz.id, answer);
  }

  @StartLoadingIndicator
  private sendSolutionToServer(quizId: string, quizAnswer: QuizAnswer): void {
    this.subscriptions.push(
      this.quizService.solve(quizId, quizAnswer)
        .subscribe((solvedQuiz: Quiz) => this.handleServerSuccess(solvedQuiz),
          (err: Error) => this.handleServerError(err))
    );
  }

  @StopLoadingIndicator
  private handleServerSuccess(quiz: Quiz): void {
    const solvedQuizNotification = new AppNotificationMessage(quiz,
      SocketTopics.TOPIC_QUIZ_ANSWERS_UPDATE,
      this.currentUser.id,
      this.currentUser.username);

    const targetUserIds = [this.quiz.creator.id];
    solvedQuizNotification.targetUserIds = targetUserIds;

    this.webSocketService.send(solvedQuizNotification);
    this.dialogRef.close();
  }

  getAnswerContent(answerId: string): string {
    if (!answerId) {
      return null;
    }

    const quizAnswer: QuizAnswer = this.quiz.getAnswerById(answerId);
    if (!quizAnswer) {
      return null;
    }

    return quizAnswer.content;
  }

  isUserAnswerCorrect(): boolean {
    return this.currentUserAnswerForQuiz.isCorrect();
  }

  hasDescription(): boolean {
    if (this.quiz && this.quiz.description && this.quiz.description !== '') {
      return true;
    }
    return false;
  }

  @StopLoadingIndicator
  private handleServerError(err: Error): void {
    AppUtil.showError(err);
  }
}
