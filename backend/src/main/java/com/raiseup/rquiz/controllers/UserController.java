package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.common.DtoMapper;
import com.raiseup.rquiz.exceptions.UserAlreadyExistException;
import com.raiseup.rquiz.models.QuizDto;
import com.raiseup.rquiz.models.RegisterRequest;
import com.raiseup.rquiz.models.UserDto;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.UserService;
import com.raiseup.rquiz.services.UserValidationService;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
public class UserController {
    private Logger logger = LoggerFactory.getLogger(UserController.class);

    private ApplicationUserRepository applicationUserRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private UserService usersService;
    private QuizService quizService;
    private UserValidationService userValidationService;
    private DtoMapper dtoMapper;

    public UserController(ApplicationUserRepository applicationUserRepository,
                          BCryptPasswordEncoder bCryptPasswordEncoder,
                          UserService usersService,
                          QuizService quizService,
                          UserValidationService userValidationService,
                          DtoMapper dtoMapper) {
        this.applicationUserRepository = applicationUserRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.usersService = usersService;
        this.quizService = quizService;
        this.dtoMapper = dtoMapper;
        this.userValidationService = userValidationService;
    }

    @GetMapping("/api/v1/users/all")
    public List<UserDto> getUsers(){
        try{
            return this.usersService.readAll()
                    .stream()
                    .map(user -> this.dtoMapper.convertUserToDto(user))
                    .collect(Collectors.toList());
        }catch (Exception ex){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cant fetch users list", ex);
        }
    }

    @GetMapping("/api/v1/users/{id}")
    public UserDto getUser(@PathVariable("id") String id){
        if (id ==  null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User id should not be null");
        }
        Optional<User> res = this.usersService.read(id);

        if(!res.isPresent()){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found");
        }
        return this.dtoMapper.convertUserToDto(res.get());
    }

    @PostMapping("/sign-up")
    public void signUp(@RequestBody RegisterRequest registerRequest) {
        try {
            Optional<List<String>> validations = this.userValidationService.validateRegisterRequest(registerRequest);
            if(validations.isPresent()) {
                final String errorMsg = this.userValidationService.buildValidationMessage(validations.get());
                this.logger.error(errorMsg);
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, errorMsg);
            }

            User user = this.dtoMapper.convertRegisterRequestToUserEntity(registerRequest);
            this.usersService.create(user);
        }catch (UserAlreadyExistException ex){
            logger.error("Cannot register.", ex);
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, ex.getMessage());
        }catch (Exception ex) {
            logger.error("Cannot register.", ex);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage() , ex);
        }
    }

    @GetMapping("/api/v1/users/{userId}/quiz")
    public List<QuizDto> getUserQuizList(@PathVariable("userId") String userId,
                                     @RequestParam(required = false) Integer page,
                                     @RequestParam(required = false) Integer size){
        try{
            this.logger.debug(String.format("Getting all quiz list for user: %s. page: %d size: %d",
                                            userId, page, size));

            if(!AppUtils.isPaginationParamsValid(page, size)){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "In order to use pagination you must provide both page and size");
            }

            HashMap<String, Object> queryParams = new HashMap<>();
            queryParams.put("creatorId", userId);
            return this.quizService.readAll(queryParams, size, page)
                    .stream()
                    .map(quiz -> this.dtoMapper.convertQuizToDto(quiz))
                    .collect(Collectors.toList());
        } catch (ResponseStatusException ex){
            logger.error("Cannot fetch quiz list.", ex);
            throw ex;
        } catch (Exception ex){
            logger.error("Cannot fetch quiz list.", ex);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch quiz list", ex);
        }
    }

    @GetMapping("/api/v1/users/{userId}/assignedQuiz")
    public List<QuizDto> getUserAssignedQuizList(@PathVariable("userId") String userId,
                                  @RequestParam(required = false) Integer page,
                                  @RequestParam(required = false) Integer size){
        try{
            this.logger.debug(String.format("Getting all assigned quiz list for user: %s. page: %d size: %d",
                    userId, page, size));

            if(!AppUtils.isPaginationParamsValid(page, size)){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "In order to use pagination you must provide both page and size");
            }

            List<QuizDto> res = this.quizService.readAllAssignedToUser(userId,size,page)
                    .stream()
                    .map(quiz -> this.dtoMapper.convertQuizToDto(quiz))
                    .collect(Collectors.toList());

            this.logger.debug(String.format("Returning %d quiz for user: %s", res.size(), userId));

            return res;
        } catch (ResponseStatusException ex){
            logger.error("Cannot fetch quiz list." + ExceptionUtils.getStackTrace(ex));
            throw ex;
        } catch (Exception ex){
            logger.error("Cannot fetch quiz list." + ExceptionUtils.getStackTrace(ex));
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch quiz list", ex);
        }
    }
}
