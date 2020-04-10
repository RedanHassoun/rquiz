import { ScssStyleService } from './../../shared/services/scss-style.service';
import { Quiz } from './../../shared/models';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizStyleService {
  public static readonly QUIZ_BACKGROUND_COLOR_BASIC = '$quiz-background-color';
  public static readonly QUIZ_BACKGROUND_COLOR_UNSOLVED = '$quiz-background-color-unsolved';

  constructor(private scssStyleService: ScssStyleService) { }

  public async getQuizBackgroundColor(quiz: Quiz): Promise<string> {
    if (quiz.isSolved()) {
      return this.scssStyleService.getVariableData(QuizStyleService.QUIZ_BACKGROUND_COLOR_BASIC);
    }
    return this.scssStyleService.getVariableData(QuizStyleService.QUIZ_BACKGROUND_COLOR_UNSOLVED);
  }
}
