package com.raiseup.rquiz.tests.unittests;

import com.raiseup.rquiz.models.QuizDto;
import com.raiseup.rquiz.models.UserDto;
import com.raiseup.rquiz.services.QuizValidationServiceImpl;
import org.junit.Test;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;

public class TestQuizValidationServiceImpl {

    @Test
    public void validateQuiz_quizHasLessThanTwoAnswers_shouldReturnValidationErr() {
        QuizValidationServiceImpl quizValidationService = new QuizValidationServiceImpl();
        QuizDto quiz = new QuizDto();
        UserDto user = new UserDto();
        user.setId("id");
        user.setUsername("test1");

        quiz.setCreator(user);
        quiz.setIsPublic(true);
        quiz.setDescription("desc");
        quiz.setTitle("title");

        Optional<List<String>> errors = quizValidationService.validateQuiz(quiz);
        assertThat(errors).isNotEmpty();
    }
}
