import { User } from './../../shared/models/user';
import { AuthenticationService } from './../../core/services/authentication.service';
import { QuizAnswer } from './../../shared/models/quiz-answer';
import { Quiz } from './../../shared/models/quiz';
import { AppUtil } from './../../shared/util/app-util';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from './../../shared/util/app-consts';
import { ClientDataServiceService } from './../../shared/services/client-data-service.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { UserAnswer } from 'src/app/shared/models/user-answer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService extends ClientDataServiceService {
  public static readonly PAGE_SIZE = 15;
  constructor(public http: HttpClient, private authenticationService: AuthenticationService) {
    super(`${AppConsts.BASE_URL}/api/v1/quiz/`, http);
  }

  getAllByPublic(isPublic: boolean, page: number) {
    let url = `${this.url}all?isPublic=${isPublic}`;
    if (page != null && typeof page !== undefined) {
      url += `&page=${page}&size=${QuizService.PAGE_SIZE}`;
    }
    return this.http.get(url, { headers: super.createAuthorizationHeader() })
      .pipe(catchError(AppUtil.handleError));
  }

  hasCorrectAnswer(quiz: Quiz): Promise<boolean> {
    for (const ans of quiz.answers) {
      if (ans.isCorrect) {
        return Promise.resolve(true);
      }
    }

    return Promise.resolve(false);
  }

  solve(quizId: string, quizAnswer: QuizAnswer): Observable<any> { // TODO: replace any
    return this.http.post(`${this.url}${quizId}/answer`, quizAnswer, { headers: super.createAuthorizationHeader() })
      .pipe(catchError(AppUtil.handleError));
  }

  public async isAlreadyAnswered(quiz: Quiz, userId: string): Promise<boolean> {
    const currentUserAnswersForQuiz: UserAnswer[] = await this.getUserAnswerForQuiz(quiz.id, userId).toPromise();
    if (currentUserAnswersForQuiz.length > 0) {
      return true;
    }

    return false;
  }

  public getUserAnswerForQuiz(quizId: string, userId: string): Observable<UserAnswer[]> {
    if (!quizId || !userId) {
      throw new Error(`Cannot get user answers for quiz, parameters must be defined`);
    }
    const url = `${this.url}${quizId}/user-answer?userId=${userId}`;
    return this.http.get(url, { headers: super.createAuthorizationHeader() })
      .pipe(map(result => result as UserAnswer[]))
      .pipe(catchError(AppUtil.handleError));
  }
}
