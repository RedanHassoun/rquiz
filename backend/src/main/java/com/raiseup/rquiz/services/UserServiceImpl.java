package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
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
    public User create(User user) {
        String id = UUID.randomUUID().toString();
        user.setId(id);
		user.setImageUrl("https://www.hindustantimes.com/rf/image_size_960x540/HT/p2/2018/09/27/Pictures/_0ab52210-c22f-11e8-ac2f-8b6cbdfc246f.PNG");
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        applicationUserRepository.save(user);
        return this.applicationUserRepository.findByUsername(user.getUsername());
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
    public void update(User user) {

    }

    @Override
    @Transactional
    public void delete(String id) {

    }
}
