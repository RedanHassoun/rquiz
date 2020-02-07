import { CoreUtil } from './../../core/common/core-util';
import { AuthenticationService } from './../../core/services/authentication.service';
import { QuizAnswer } from './../../shared/models/quiz-answer';
import { Quiz } from './../../shared/models/quiz';
import { AppUtil } from './../../shared/util/app-util';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from './../../shared/util/app-consts';
import { ClientDataService } from '../../shared/services/client-data.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { UserAnswer } from 'src/app/shared/models/user-answer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService extends ClientDataService {
  public static readonly PAGE_SIZE = 15;
  constructor(public http: HttpClient, private authenticationService: AuthenticationService) {
    super(`${AppConsts.BASE_URL}/api/v1/quiz/`, http);
  }

  getAllByPublic(isPublic: boolean, page: number) {
    let url = `${this.url}all?isPublic=${isPublic}`;
    if (page != null && typeof page !== undefined) {
      url += `&page=${page}&size=${QuizService.PAGE_SIZE}`;
    }
    return this.http.get(url, { headers: CoreUtil.createAuthorizationHeader() })
      .pipe(map(resultJSON => {
        return this.quizInstanceFromJSON(resultJSON);
      }))
      .pipe(catchError(AppUtil.handleError));
  }

  public solve(quizId: string, quizAnswer: QuizAnswer): Observable<Quiz> {
    return this.http.post(`${this.url}${quizId}/answer`, quizAnswer, { headers: CoreUtil.createAuthorizationHeader() })
      .pipe(map(quiz => quiz as Quiz))
      .pipe(catchError(AppUtil.handleError));
  }

  public getUserAnswerForQuiz(quizId: string, userId: string): Observable<UserAnswer[]> {
    if (!quizId || !userId) {
      throw new Error(`Cannot get user answers for quiz, parameters must be defined`);
    }
    const url = `${this.url}${quizId}/user-answer?userId=${userId}`;
    return this.http.get(url, { headers: CoreUtil.createAuthorizationHeader() })
      .pipe(map(result => result as UserAnswer[]))
      .pipe(catchError(AppUtil.handleError));
  }

  private quizInstanceFromJSON(quizJSON: any): Quiz {
    if (!quizJSON) {
      return null;
    }
    const quiz: Quiz = JSON.parse(quizJSON);
    Object.setPrototypeOf(quiz, Quiz.prototype);
    return quiz;
  }
}
