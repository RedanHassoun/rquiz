package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import org.slf4j.Logger;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static java.util.Collections.emptyList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final Logger logger;
    private ApplicationUserRepository applicationUserRepository;

    public UserDetailsServiceImpl(ApplicationUserRepository applicationUserRepository,
                                  Logger logger){
        this.applicationUserRepository = applicationUserRepository;
        this.logger = logger;
    }
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = applicationUserRepository.findByUsername(username);
        if (user == null) {
            this.logger.error(String.format("Cannot find user: %s", username));
            throw new UsernameNotFoundException(username);
        }

        UserDetails userDetailsFromDB = new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                emptyList());
        this.logger.debug(String.format("Returning user: %s", userDetailsFromDB.getUsername()));
        return userDetailsFromDB;
    }
}
