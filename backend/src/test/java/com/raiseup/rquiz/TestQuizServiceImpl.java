package com.raiseup.rquiz;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.exceptions.QuizNotFoundException;
import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.repo.QuizRepository;
import com.raiseup.rquiz.services.AmazonClient;
import com.raiseup.rquiz.services.QuizServiceImpl;
import org.junit.Test;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import java.util.Optional;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class TestQuizServiceImpl {
    private QuizRepository mockQuizRepo;
    private ApplicationUserRepository mockUserRepo;
    private AmazonClient mockAmazonClient;
    private TransactionTemplate mockTransactionTemplate;
    private PlatformTransactionManager mockPlatformTransactionManager;

    public TestQuizServiceImpl() {
        init();
    }

    private void init() {
        this.mockQuizRepo = mock(QuizRepository.class);
        this.mockUserRepo = mock(ApplicationUserRepository.class);
        this.mockAmazonClient = mock(AmazonClient.class);
        this.mockTransactionTemplate = mock(TransactionTemplate.class);
        this.mockPlatformTransactionManager = mock(PlatformTransactionManager.class);
    }

    @Test(expected = IllegalOperationException.class)
    public void create_creatorNotFound_throwAnException() throws AppException {
        ApplicationUserRepository mockUserRepo = mock(ApplicationUserRepository.class);
        when(mockUserRepo.findById(anyString())).thenReturn(Optional.empty());

        QuizServiceImpl quizService = new QuizServiceImpl(this.mockQuizRepo, mockUserRepo,
                this.mockAmazonClient, this.mockTransactionTemplate, this.mockPlatformTransactionManager);

        final Quiz quiz = new Quiz();
        final User user = new User();
        user.setId("test");
        quiz.setCreator(user);
        quizService.create(quiz);
    }

    @Test(expected = AppException.class)
    public void update_idIsNull_throwAnException() throws AppException {
        Quiz quizToUpdate = new Quiz();
        QuizServiceImpl quizService = new QuizServiceImpl(this.mockQuizRepo, this.mockUserRepo,
                this.mockAmazonClient, this.mockTransactionTemplate, this.mockPlatformTransactionManager);

        quizService.update(quizToUpdate);
    }

    @Test(expected = QuizNotFoundException.class)
    public void update_quizNotExist_throwAnException() throws AppException {
        QuizRepository mockQuizRepo = mock(QuizRepository.class);
        when(mockQuizRepo.findById(anyString())).thenReturn(Optional.empty());

        Quiz quizToUpdate = new Quiz();
        quizToUpdate.setId("test");
        QuizServiceImpl quizService = new QuizServiceImpl(mockQuizRepo, this.mockUserRepo,
                this.mockAmazonClient, this.mockTransactionTemplate, this.mockPlatformTransactionManager);
        quizService.update(quizToUpdate);
    }
}
