package com.example.demo.controllers;

import com.example.demo.models.ApplicationUser;
import com.example.demo.repo.ApplicationUserRepository;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    private ApplicationUserRepository applicationUserRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private UserService usersService;

    public UserController(ApplicationUserRepository applicationUserRepository,
                          BCryptPasswordEncoder bCryptPasswordEncoder,
                          UserService usersService) {
        this.applicationUserRepository = applicationUserRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.usersService = usersService;
    }

    @GetMapping("")
    public List<ApplicationUser> getUsers(){
        try{
            return new ArrayList<>(this.usersService.readAll());
        }catch (Exception ex){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cant fetch users list", ex);
        }
    }

    @GetMapping("{id}")
    public ApplicationUser getUser(@PathVariable("id") String id){
        if (id ==  null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User id should not be null");
        }
        Optional<ApplicationUser> res = this.usersService.read(id);

        if(!res.isPresent()){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found");
        }
        return res.get();
    }


    @PostMapping("/sign-up")
    public void signUp(@RequestBody ApplicationUser user) {
        this.usersService.create(user);
    }


}
