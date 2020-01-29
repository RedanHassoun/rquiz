package com.raiseup.rquiz.services;

import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.exceptions.QuizNotFoundException;
import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.repo.QuizRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class QuizServiceImpl implements QuizService {
    private Logger logger = LoggerFactory.getLogger(QuizServiceImpl.class);
    private QuizRepository quizRepository;
    private UserAnswerService userAnswerService;
    private ApplicationUserRepository applicationUserRepository;
    private AmazonClient amazonClient;

    public QuizServiceImpl(QuizRepository quizRepository,
                           UserAnswerService userAnswerService,
                           ApplicationUserRepository applicationUserRepository,
                           AmazonClient amazonClient){
        this.quizRepository = quizRepository;
        this.userAnswerService = userAnswerService;
        this.applicationUserRepository = applicationUserRepository;
        this.amazonClient = amazonClient;
    }

    @Override
    @Transactional
    public Quiz create(Quiz quiz) throws AppException {
        quiz.getAnswers().forEach(answer -> answer.setQuiz(quiz));

        Optional<User> creator = this.applicationUserRepository.findById(quiz.getCreator().getId());

        if(!creator.isPresent()) {
            AppUtils.throwAndLogException(new IllegalOperationException(
                    String.format("Cannot create quiz because the quiz creator (%s) doesn't exist in DB",
                            quiz.getCreator().getId())));
        }

        return this.quizRepository.save(quiz);
    }

    @Override
    @Transactional(readOnly=true)
    public Optional<Quiz> read(String id) {
        this.logger.debug(String.format("Reading quiz: %s", id));
        Optional<Quiz> quizOptional = this.quizRepository.findById(id);
        if(!quizOptional.isPresent()){
            return Optional.empty();
        }
        Quiz quiz = quizOptional.get();
        return Optional.of(quiz);
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll() {
        Collection<Quiz> quizList = this.quizRepository.findAll();
        this.logger.debug(String.format(
                "Returning %d quiz items", quizList != null ? quizList.size() : 0));
        return quizList;
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(Boolean isPublic, Integer size, Integer page) {
        Pageable pageable = null;

        if(size != null && page != null) {
            this.logger.debug(String.format("Preparing page request for fetching quiz list. page=%d, size=%d",
                    page, size));
            pageable = PageRequest.of(page, size,
                    Sort.Direction.DESC, "createdAt");
        }

        Collection<Quiz> quizListToReturn = this.getQuizList(isPublic, pageable);
        this.logger.debug(String.format(
                "Returning %d quiz items", quizListToReturn != null ? quizListToReturn.size() : 0));
        return quizListToReturn;
    }

    private Collection<Quiz> getQuizList(Boolean isPublic, Pageable pageable) {
        Collection<Quiz> quizListToReturn;
        if (isPublic == null) {
            if (pageable != null) {
                quizListToReturn = this.quizRepository.findAll(pageable).getContent();
            } else {
                quizListToReturn = this.quizRepository.findAll();
            }

            return quizListToReturn;
        } else {
            if (pageable != null) {
                quizListToReturn = this.quizRepository.findAllByPublic(isPublic, pageable);
            } else {
                quizListToReturn = this.quizRepository.findAllByPublic(isPublic);
            }

            return quizListToReturn;
        }
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(HashMap<String, Object> filterParams, Integer size, Integer page) {
        this.logger.debug(
                String.format(
                        "Reading all quiz list by parameters: %s", AppUtils.paramsMapToString(filterParams)));

        List<Quiz> quizList;
        if(size == null || page == null) {
            this.logger.debug("Returning without pagination");
            quizList = this.quizRepository.findQuizListByParameters(filterParams,null);
        } else {
            this.logger.debug(String.format("Returning without pagination. page: %d, size: %d", page, size));
            quizList = this.quizRepository.findQuizListByParameters(filterParams,
                    PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"));
        }

        this.logger.debug(String.format("Returning %d quiz", quizList.size()));

        return quizList;
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAllAssignedToUser(String userId, Integer size, Integer page) {
        this.logger.debug(
                String.format(
                        "Reading all quiz assigned to user: %s", userId));

        List<Quiz> quizList;
        if(size == null || page == null){
            quizList = this.quizRepository.findByAssignedUsers_Id(userId, null);
        } else {
            quizList = this.quizRepository.findByAssignedUsers_Id(userId,
                    PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"));
        }

        this.logger.debug(String.format(
                "Returning %d quiz items", quizList != null ? quizList.size() : 0));
        return quizList;
    }

    @Override
    @Transactional
    public void update(Quiz quiz) throws AppException {
        if(quiz == null) {
            AppUtils.throwAndLogException(
                    new IllegalOperationException("Cannot update quiz because it is not defined"));
        }

        if(quiz.getId() == null || quiz.getId().equals("")){
            AppUtils.throwAndLogException(
                    new IllegalOperationException("Cannot update quiz without id"));
        }

        Optional<Quiz> quizFromDBOptional = this.quizRepository.findById(quiz.getId());

        if (!quizFromDBOptional.isPresent()){
            AppUtils.throwAndLogException(
                    new QuizNotFoundException("Cannot update quiz because it is not found in DB"));
        }

        this.quizRepository.save(quiz);
    }

    @Override
    @Transactional
    public void delete(String id) throws AppException {
        Optional<Quiz> quizOptional = this.quizRepository.findById(id);
        if(!quizOptional.isPresent()){
            AppUtils.throwAndLogException(
                    new QuizNotFoundException(String.format(
                            "Cannot remove quiz %s because it doesn't exist", id)));
        }

        Quiz quizFromDB = quizOptional.get();

        if (quizFromDB.getImageUrl() != null) {
            try {
                this.amazonClient.deleteFileFromS3Bucket(quizFromDB.getImageUrl());
            } catch (Exception ex) {
                this.logger.error(String.format("Cannot delete image for quiz: %s. Image url: %s",
                        quizFromDB.getId(), quizFromDB.getImageUrl()), ex);
            }
        }

        this.quizRepository.delete(quizFromDB);
    }
}
