import { Quiz } from './../models/quiz';
import { User } from './../models/user';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  public getImageUrlForUser(user: User): string {
    if (user && user.imageUrl) {
      return user.imageUrl;
    }

    return 'assets/img/perm_identity-24px.svg';
  }

  public getImageUrlForQuiz(quiz: Quiz): string {
    if (quiz && quiz.imageUrl) {
      return quiz.imageUrl;
    }

    return 'assets/img/quiz-place-holder.svg';
  }
}
