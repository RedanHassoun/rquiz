package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.models.User;
import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.UserService;
import javafx.util.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    private Logger logger = LoggerFactory.getLogger(UserController.class);

    private ApplicationUserRepository applicationUserRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private UserService usersService;
    private QuizService quizService;

    public UserController(ApplicationUserRepository applicationUserRepository,
                          BCryptPasswordEncoder bCryptPasswordEncoder,
                          UserService usersService,
                          QuizService quizService) {
        this.applicationUserRepository = applicationUserRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.usersService = usersService;
        this.quizService = quizService;
    }

    @GetMapping("/all")
    public List<User> getUsers(){
        try{
            return this.usersService.readAll()
                    .stream()
                    .map(user -> {
                        user.setPassword(null);
                        return user;
                    }).collect(Collectors.toList());
        }catch (Exception ex){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cant fetch users list", ex);
        }
    }

    @GetMapping("{id}")
    public User getUser(@PathVariable("id") String id){
        if (id ==  null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User id should not be null");
        }
        Optional<User> res = this.usersService.read(id);

        if(!res.isPresent()){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found");
        }
        return res.get();
    }

    @PostMapping("/sign-up")
    public void signUp(@RequestBody User user) {
        this.usersService.create(user);
    }

    @GetMapping("/{userId}/quiz")
    public List<Quiz> getQuizList(@PathVariable("userId") String userId,
                                  @RequestParam(required = false) Integer page,
                                  @RequestParam(required = false) Integer size){
        try{
            this.logger.debug(String.format("Getting all quiz list for user: %s. page: %d size: %d",
                                            userId, page, size));

            if(page == null && size == null){
                // TODO: fix Intelij warning
                HashMap<String, Object> queryParams = AppUtils.createQueryParametersMap(new Pair<>("creatorId", userId));
                Collection<Quiz> res = this.quizService.readAll(queryParams);
                return new ArrayList<>(res);
            }

            if(page == null || size == null){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "In order to use pagination you must provide both page and size");
            }
            HashMap<String, Object> queryParams = AppUtils.createQueryParametersMap(new Pair<>("creatorId", userId));
            return new ArrayList<>(this.quizService.readAll(queryParams, size, page));
        } catch (ResponseStatusException ex){
            logger.error("Cannot fetch quiz list." + ex.toString());
            throw ex;
        } catch (Exception ex){
            logger.error("Cannot fetch quiz list." + ex.toString());
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch quiz list", ex);
        }
    }
}
