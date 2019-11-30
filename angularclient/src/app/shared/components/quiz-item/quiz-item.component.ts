import { AppNotificationMessage, TOPIC_QUIZ_DELETED_UPDATE } from './../../../core/model/socket-consts';
import { NotificationService } from './../../../core/services/notification.service';
import { AuthenticationService } from './../../../core/services/authentication.service';
import { QuizService } from './../../../feed/services/quiz.service';
import { ShowQuizComponent } from '../show-quiz/show-quiz.component';
import { AppUtil } from '../../util/app-util';
import { NavigationHelperService } from '../../services/navigation-helper.service';
import { Subscription } from 'rxjs';
import { Quiz } from '../../models/quiz';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-quiz-item',
  templateUrl: './quiz-item.component.html',
  styleUrls: ['./quiz-item.component.scss']
})
export class QuizItemComponent implements OnInit, OnDestroy {
  @Input() public quiz: Quiz;
  @Input() currentUserId: string;
  private subscriptions: Subscription[] = [];

  constructor(private navigationService: NavigationHelperService,
    private quizService: QuizService,
    private authService: AuthenticationService,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  getQuizImage() {
    if (this.quiz.imageUrl) {
      return this.quiz.imageUrl;
    }

    return 'assets/img/quiz-place-holder.svg';
  }

  showQuiz(quizId: string): void {
    this.subscriptions.push(
      this.navigationService.openDialog(ShowQuizComponent, undefined, quizId)
        .subscribe()
    );
  }

  deleteQuiz(quizId: string): void {
    this.navigationService
      .openYesNoDialogNoCallback('Are you sure you want to delete?')
      .subscribe(res => {
        if (res) {
          this.quizService.delete(quizId)
            .subscribe(() => {
              const deletedQuizId = new AppNotificationMessage({ id: quizId });
              this.notificationService.send(TOPIC_QUIZ_DELETED_UPDATE, deletedQuizId);
            }, (err) => {
              AppUtil.showError(err);
            });
        }
      });
  }

  canDeleteQuiz(): boolean {
    if (!this.currentUserId) {
      return false;
    }

    if (this.quiz.creatorId === this.currentUserId) {
      return true;
    }

    return false;
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
