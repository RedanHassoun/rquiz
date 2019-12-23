package com.raiseup.rquiz.services;

import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.exceptions.UserAlreadyExistException;
import com.raiseup.rquiz.exceptions.UserNotFoundException;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private ApplicationUserRepository applicationUserRepository;


    public UserServiceImpl(BCryptPasswordEncoder bCryptPasswordEncoder,
                           ApplicationUserRepository applicationUserRepository){
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.applicationUserRepository = applicationUserRepository;
    }

    @Override
    @Transactional
    public User create(User user) throws AppException {
        try{
            String id = UUID.randomUUID().toString();
            user.setId(id);
            user.setImageUrl("https://www.hindustantimes.com/rf/image_size_960x540/HT/p2/2018/09/27/Pictures/_0ab52210-c22f-11e8-ac2f-8b6cbdfc246f.PNG");
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            applicationUserRepository.save(user);
            return this.applicationUserRepository.findByUsername(user.getUsername());
        }catch (ConstraintViolationException ex){
            throw new UserAlreadyExistException(ex.getMessage());
        }
    }

    @Override
    @Transactional(readOnly=true)
    public Optional<User> read(String id) {
        return this.applicationUserRepository.findById(id);
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<User> readAll() {
        return applicationUserRepository.findAll();
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<User> readAll(int size, int page) {
        return null;
    }

    @Override
    @Transactional
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

        User userFromDB = userFromDBOptional.get();
        userFromDB.setImageUrl(user.getImageUrl()); // TODO: the images should be uploaded to storage
        userFromDB.setAbout(user.getAbout());
        this.applicationUserRepository.save(userFromDB);
    }

    @Override
    @Transactional
    public void delete(String id) {

    }
}
