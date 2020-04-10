import { TestBed } from '@angular/core/testing';

import { QuizStyleService } from './quiz-style.service';

describe('QuizStyleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuizStyleService = TestBed.get(QuizStyleService);
    expect(service).toBeTruthy();
  });
});
