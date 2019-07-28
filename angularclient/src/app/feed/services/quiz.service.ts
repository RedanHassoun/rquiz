import { QuizAnswer } from './../../shared/models/quiz-answer';
import { Quiz } from './../../shared/models/quiz';
import { AppUtil } from './../../shared/util/app-util';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from './../../shared/util/app-consts';
import { ClientDataServiceService } from './../../shared/services/client-data-service.service';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { UserAnswer } from 'src/app/shared/models/user-answer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService extends ClientDataServiceService {
  public static readonly PAGE_SIZE = 20;
  constructor(public http: HttpClient) {
    super(`${AppConsts.BASE_URL}/v1/quiz/`, http);
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
}
