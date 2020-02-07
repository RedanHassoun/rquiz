import { TestBed } from '@angular/core/testing';

import { QuizCrudService } from './quiz-crud.service';

describe('QuizCrudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuizCrudService = TestBed.get(QuizCrudService);
    expect(service).toBeTruthy();
  });
});
