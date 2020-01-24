import { Router } from '@angular/router';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../core/services/user-service.service';
import { AppNotificationMessage, TOPIC_QUIZ_DELETED_UPDATE } from '../../../core/model/socket-consts';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { QuizService } from '../../services/quiz.service';
import { ShowQuizComponent } from '../show-quiz/show-quiz.component';
import { AppUtil } from '../../../shared/util/app-util';
import { NavigationHelperService } from '../../../shared/services/navigation-helper.service';
import { Subscription } from 'rxjs';
import { Quiz } from '../../../shared/models/quiz';
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
    private notificationService: NotificationService,
    private router: Router) {
  }

  ngOnInit() {
  }

  getQuizImage() {
    if (this.quiz.imageUrl) {
      return this.quiz.imageUrl;
    }

    return 'assets/img/quiz-place-holder.svg';
  }

  showQuiz(): void {
    this.subscriptions.push(
      this.navigationService.openDialog(ShowQuizComponent, undefined, this.quiz)
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
              const deletedQuizId = new AppNotificationMessage({ id: quizId }, TOPIC_QUIZ_DELETED_UPDATE);
              this.notificationService.send(deletedQuizId);
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

    if (this.quiz.creator.id === this.currentUserId) {
      return true;
    }

    return false;
  }

  showUser(user: User) {
    if (!user) {
      AppUtil.handleNullError('User');
    }

    this.router.navigate(['users', user.id]);
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
