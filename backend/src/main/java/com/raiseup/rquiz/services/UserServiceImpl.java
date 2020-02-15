package com.raiseup.rquiz.services;

import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.exceptions.UserAlreadyExistException;
import com.raiseup.rquiz.exceptions.UserNotFoundException;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.repo.SearchCriteria;
import com.raiseup.rquiz.repo.UserAnswerRepository;
import com.raiseup.rquiz.repo.UserSearchSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {
    private Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private ApplicationUserRepository applicationUserRepository;
    private EntityManager entityManager;
    private PlatformTransactionManager transactionManager;
    private TransactionTemplate transactionTemplate;
    private AmazonClient amazonClient;
    private UserAnswerRepository userAnswerRepository;

    public UserServiceImpl(BCryptPasswordEncoder bCryptPasswordEncoder,
                           ApplicationUserRepository applicationUserRepository,
                           PlatformTransactionManager transactionManager,
                           EntityManager entityManager,
                           AmazonClient amazonClient,
                           UserAnswerRepository userAnswerRepository){
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.applicationUserRepository = applicationUserRepository;
        this.transactionManager = transactionManager;
        this.entityManager = entityManager;
        this.amazonClient = amazonClient;
        this.userAnswerRepository = userAnswerRepository;
    }

    @PostConstruct
    private void initTransaction() {
        this.transactionTemplate = new TransactionTemplate(this.transactionManager);
    }

    @Override
    @Transactional
    public User create(User user) throws AppException {
        if (user == null) {
            throw new IllegalOperationException("Cannot create user because it is not defined");
        }

        User UserFromDB = this.applicationUserRepository.findByUsername(user.getUsername());
        if (UserFromDB != null) {
            final String errorMsg = String.format("Cannot create user %s because it already exist", user.getUsername());
            throw new UserAlreadyExistException(errorMsg);
        }

        String id = UUID.randomUUID().toString();
        user.setId(id);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        applicationUserRepository.save(user);
        return this.applicationUserRepository.findByUsername(user.getUsername());
    }

    @Override
    @Transactional(readOnly=true)
    public Optional<User> read(String id) throws AppException {
        Optional<User> userOptional = this.applicationUserRepository.findById(id);
        if (!userOptional.isPresent()) {
            throw new UserNotFoundException(String.format("Cannot find user %s", id));
        }
        User user = userOptional.get();
        final Long correctAnswersCount = this.userAnswerRepository.findCorrectUserAnswersCountByUserId(id);
        final Long allAnswersCount = this.userAnswerRepository.findUserAnswersCountByUserId(id);

        user.setTotalNumberOfCorrectAnswers(correctAnswersCount);
        user.setTotalNumberOfAnswers(allAnswersCount);

        return Optional.of(user);
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<User> readAll() {
        return applicationUserRepository.findAll();
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<User> readAll(Integer size, Integer page) {
        Pageable pageable = null;

        if(size != null && page != null) {
            this.logger.debug(String.format("Preparing page request for fetching users list. page=%d, size=%d",
                    page, size));
            pageable = PageRequest.of(page, size,
                    Sort.Direction.DESC, "createdAt");
        }

        Collection<User> usersListToReturn = this.getUserList(pageable);
        this.logger.debug(String.format(
                "Returning %d users", usersListToReturn != null ? usersListToReturn.size() : 0));
        return usersListToReturn;
    }

    private Collection<User> getUserList(Pageable pageable) {
        if (pageable == null) {
            return this.applicationUserRepository.findAll();
        }

        return this.applicationUserRepository.findAll(pageable).getContent();
    }

    @Override
    public Collection<User> search(String searchQuery, Integer size, Integer page) throws AppException {
        if (searchQuery == null) {
            throw new IllegalOperationException(
                    "Cannot start users search, search query must be defined");
        }
        Pattern pattern = Pattern.compile("(\\w+?)(:|<|>)(\\w+)");
        Matcher matcher = pattern.matcher(searchQuery);
        if (!matcher.find()) {
            throw new IllegalOperationException(
                    String.format("Cannot perform search '%s', please check the syntax", searchQuery));
        }

        SearchCriteria searchCriteria = new SearchCriteria(
                matcher.group(1), matcher.group(2), matcher.group(3));

        Specification<User> userSpecification = new UserSearchSpecification(searchCriteria);
        return this.applicationUserRepository.findAll(userSpecification);
    }

    @Override
    public void update(User user) throws AppException {
        if(user == null || user.getId() == null) {
            AppUtils.throwAndLogException(
                    new IllegalOperationException("Cannot update user, user must be defined and has an Id"));
        }

        Optional<User> userFromDBOptional = this.applicationUserRepository.findById(user.getId());
        if(!userFromDBOptional.isPresent()){
            AppUtils.throwAndLogException(new UserNotFoundException(String.format(
                    "Cannot update user %s because it is not found", user.getId())));
        }
        final User userFromDB = userFromDBOptional.get();
        final String previousImageUrl = userFromDB.getImageUrl();
        this.transactionTemplate.execute(status -> {
            userFromDB.setImageUrl(user.getImageUrl());
            userFromDB.setAbout(user.getAbout());
            return this.applicationUserRepository.save(userFromDB);
        });
        try {
            if (previousImageUrl != null) {
                this.amazonClient.deleteFileFromS3Bucket(previousImageUrl);
            }
        } catch (Exception ex) {
            this.logger.error(String.format("Cannot delete previous image URL for user: %s, image url: %s",
                    userFromDB.getId(), previousImageUrl), ex);
        }
    }

    @Override
    @Transactional
    public void delete(String id) {

    }
}
