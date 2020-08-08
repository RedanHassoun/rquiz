package com.raiseup.rquiz.tests.componentintegrationtests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.raiseup.rquiz.common.DtoMapper;
import com.raiseup.rquiz.controllers.QuizController;
import com.raiseup.rquiz.services.QuizAssignmentService;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.QuizValidationService;
import com.raiseup.rquiz.services.UserAnswerService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Optional;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = QuizController.class, secure = false)
public class TestQuizController {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private QuizService quizService;
    @MockBean
    private UserAnswerService userAnswerService;
    @MockBean
    private QuizValidationService quizValidationService;
    @MockBean
    private QuizAssignmentService quizAssignmentService;
    @MockBean
    private DtoMapper dtoMapper;
    @MockBean
    private Logger mockLogger;

    @Test
    public void getQuizList_providePageButNoSize_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(
                get("/api/v1/quiz/all?page=0"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void findQuiz_quizNotExist_shouldReturn404() throws Exception {
        when(this.quizService.read("test-quiz")).thenReturn(Optional.empty());

        mockMvc.perform(
                get("/api/v1/quiz/test-quiz")
        ).andExpect(status().isNotFound());
    }
}
