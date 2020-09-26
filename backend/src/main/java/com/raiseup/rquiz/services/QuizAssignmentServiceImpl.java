package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.exceptions.QuizNotFoundException;
import com.raiseup.rquiz.exceptions.UserNotFoundException;
import com.raiseup.rquiz.models.QuizAssignmentRequest;
import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizAssignmentServiceImpl implements QuizAssignmentService {
    private final Logger logger;
    private ApplicationUserRepository applicationUserRepository;
    private QuizService quizService;

    public QuizAssignmentServiceImpl(ApplicationUserRepository applicationUserRepository,
                                     QuizService quizService,
                                     Logger logger)
    {
        this.applicationUserRepository = applicationUserRepository;
        this.quizService = quizService;
        this.logger = logger;
    }

    @Override
    @Transactional
    public void assignToUser(QuizAssignmentRequest quizAssignmentRequest) throws AppException {

        this.logger.debug(String.format("Assigning quiz %s to user %s",
                quizAssignmentRequest.getQuizId(), quizAssignmentRequest.getUserId()));

        Optional<Quiz> quizOptional = this.quizService.read(quizAssignmentRequest.getQuizId());
        if (!quizOptional.isPresent()) {
            throw new QuizNotFoundException(String.format("Quiz %s not found", quizAssignmentRequest.getUserId()));
        }
        final Quiz quiz = quizOptional.get();
        if (!quiz.isCreatedBy(quizAssignmentRequest.getAssignerId())) {
            throw new IllegalOperationException(
                    String.format("Cannot assign quiz %s because you are not its creator", quizAssignmentRequest.getQuizId()));
        }

        Optional<User> userOptional = this.applicationUserRepository.findById(quizAssignmentRequest.getUserId());
        if (!userOptional.isPresent()) {
            throw new UserNotFoundException(String.format("User %s not found", quizAssignmentRequest.getUserId()));
        }

        if (this.isAssignedToUser(quiz, quizAssignmentRequest.getUserId())) {
            throw new IllegalOperationException(
                    String.format("quiz %s is already assigned to User %s", quiz.getId(),
                            quizAssignmentRequest.getUserId()));
        }

        quiz.getAssignedUsers().add(userOptional.get());
        this.logger.debug(String.format("Assigning quiz %s to user %s", quiz.getId(), quizAssignmentRequest.getUserId()));
        this.quizService.update(quiz);
    }

    private void validateAssignmentToUser(QuizAssignmentRequest quizAssignmentRequest) throws AppException {
        if (quizAssignmentRequest == null || quizAssignmentRequest.getUserId() == null ||
                quizAssignmentRequest.getQuizId() == null) {
            throw new IllegalOperationException(
                    "Cannot assign quiz, one of the parameters is null");
        }

    }

    private boolean isAssignedToUser(Quiz quiz, String userId) {
        if (quiz.getAssignedUsers() == null) {
            return false;
        }
        List<User> assigned = quiz.getAssignedUsers()
                .stream()
                .filter(user -> user.getId().equals(userId))
                .collect(Collectors.toList());
        return !assigned.isEmpty();
    }
}
