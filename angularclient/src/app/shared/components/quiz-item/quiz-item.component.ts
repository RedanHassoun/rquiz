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
export class QuizItemComponent implements OnInit {
  @Input() public quiz: Quiz;
  private subscriptions: Subscription[] = [];

  constructor(private navigationService: NavigationHelperService) {
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

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
