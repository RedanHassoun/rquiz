package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static java.util.Collections.emptyList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    private ApplicationUserRepository applicationUserRepository;

    public UserDetailsServiceImpl(ApplicationUserRepository applicationUserRepository){
        this.applicationUserRepository = applicationUserRepository;
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
        return userDetailsFromDB;
    }
}
