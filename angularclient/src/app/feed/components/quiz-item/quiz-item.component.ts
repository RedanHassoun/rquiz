import { QuizStyleService } from './../../services/quiz-style.service';
import { AppNotificationMessage } from './../../../shared/index';
import { AppConsts } from './../../../shared/util/app-consts';
import { ImageService } from './../../../shared/services/image.service';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/user';
import { SocketTopics } from '../../../shared/util';
import { NotificationService } from '../../../core/services/notification.service';
import { QuizService } from '../../services/quiz.service';
import { ShowQuizComponent } from '../show-quiz/show-quiz.component';
import { AppUtil } from '../../../shared/util/app-util';
import { NavigationHelperService } from '../../../shared/services/navigation-helper.service';
import { Subscription } from 'rxjs';
import { Quiz } from '../../../shared/models/quiz';
import { Component, Input, OnDestroy, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-quiz-item',
  templateUrl: './quiz-item.component.html',
  styleUrls: ['./quiz-item.component.scss']
})
export class QuizItemComponent implements AfterContentInit, OnDestroy {
  @Input() public quiz: Quiz;
  @Input() currentUserId: string;
  @Input() public changeBackgroundColorWhenSolved = true;
  isOwnedByCurrentUser: boolean;
  private subscriptions: Subscription[] = [];
  public quizContainerBackgroundColor = QuizStyleService.QUIZ_BACKGROUND_COLOR_BASIC;

  constructor(private navigationService: NavigationHelperService,
    private quizService: QuizService,
    private notificationService: NotificationService,
    private router: Router,
    private imageService: ImageService,
    private quizStyleService: QuizStyleService) {
  }

  async ngAfterContentInit() {
    // TODO: use generics in rest services
    this.quiz = Object.setPrototypeOf(this.quiz, Quiz.prototype);
    this.isOwnedByCurrentUser = this.quiz.isCreatedByUser(this.currentUserId);

    if (!!this.changeBackgroundColorWhenSolved) {
      this.quizContainerBackgroundColor = await this.quizStyleService.getQuizBackgroundColor(this.quiz);
    }
  }

  getQuizImage(): string {
    return this.imageService.getImageUrlForQuiz(this.quiz);
  }

  showQuiz(): void {
    this.subscriptions.push(
      this.navigationService.openDialog(ShowQuizComponent, '90vh', this.quiz)
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
              const deletedQuizId = new AppNotificationMessage({ id: quizId }, SocketTopics.TOPIC_QUIZ_DELETED_UPDATE);
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

    this.router.navigate([AppConsts.PEOPLE_LIST, user.id]);
  }

  getAssignedUsers(): User[] {
    if (!!this.quiz.isPublic) {
      return null;
    }

    return this.quiz.assignedUsers;
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }

  getTimeAgo(): string {
    return AppUtil.getTimeAgo(this.quiz);
  }
}
