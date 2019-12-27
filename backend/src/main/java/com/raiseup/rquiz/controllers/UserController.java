package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.common.DtoMapper;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.exceptions.UserNotFoundException;
import com.raiseup.rquiz.models.QuizDto;
import com.raiseup.rquiz.models.RegisterRequest;
import com.raiseup.rquiz.models.UpdateUserRequestDto;
import com.raiseup.rquiz.models.UserDto;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.UserService;
import com.raiseup.rquiz.services.UserValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    public List<UserDto> getUsers() throws Exception {
        try{
            return this.usersService.readAll()
                    .stream()
                    .map(user -> this.dtoMapper.convertUserToDto(user))
                    .collect(Collectors.toList());
        }catch (Exception ex){
            this.logger.error("Cant fetch all users list", ex);
            throw ex;
        }
    }

    @GetMapping("/api/v1/users/{id}")
    public UserDto getUser(@PathVariable("id") String id) throws Exception {
        try{
            if (id ==  null){
                throw new IllegalOperationException("User id should not be null");
            }
            Optional<User> res = this.usersService.read(id);

            if(!res.isPresent()){
                throw new UserNotFoundException(String.format("User %s not found", id));
            }
            return this.dtoMapper.convertUserToDto(res.get());
        }catch (Exception ex) {
            this.logger.error(String.format("Cant fetch user: %s", id), ex);
            throw ex;
        }
    }

    @PostMapping("/sign-up")
    public void signUp(@RequestBody RegisterRequest registerRequest) throws Exception {
        try {
            Optional<List<String>> validations = this.userValidationService.validateRegisterRequest(registerRequest);
            if(validations.isPresent()) {
                final String errorMsg = this.userValidationService.buildValidationMessage(validations.get());
                throw new IllegalOperationException(errorMsg);
            }

            User user = this.dtoMapper.convertRegisterRequestToUserEntity(registerRequest);
            this.usersService.create(user);
        } catch (Exception ex) {
            String userToRegister = registerRequest != null ? registerRequest.getUsername() : null;
            this.logger.error(String.format("Cant register user: %s", userToRegister), ex);
            throw ex;
        }
    }

    @PutMapping("/api/v1/users/{userId}")
    public void updateUserDetails(@PathVariable("userId") String userId,
                                         @RequestBody UpdateUserRequestDto updateUserRequestDto) throws Exception {
        try{
            Optional<List<String>> validation = this.userValidationService.validateObject(updateUserRequestDto);

            if(validation.isPresent()){
                throw new IllegalOperationException(
                        this.userValidationService.buildValidationMessage(validation.get()));
            }

            User userToUpdate = this.dtoMapper.convertUpdateUserRequestTOUserEntity(updateUserRequestDto);
            this.usersService.update(userToUpdate);
        } catch (Exception ex){
            this.logger.error(String.format("Cannot update user %s", userId), ex);
            throw ex;
        }
    }

    @GetMapping("/api/v1/users/{userId}/quiz")
    public List<QuizDto> getUserQuizList(@PathVariable("userId") String userId,
                                     @RequestParam(required = false) Integer page,
                                     @RequestParam(required = false) Integer size) throws Exception {
        try{
            this.logger.debug(String.format("Getting all quiz list for user: %s. page: %d size: %d",
                                            userId, page, size));

            if(!AppUtils.isPaginationParamsValid(page, size)){
                throw new IllegalOperationException(
                        "In order to use pagination you must provide both page and size");
            }

            HashMap<String, Object> queryParams = new HashMap<>();
            User creator = new User();
            creator.setId(userId);
            queryParams.put("creator", creator);
            return this.quizService.readAll(queryParams, size, page)
                    .stream()
                    .map(quiz -> this.dtoMapper.convertQuizToDto(quiz))
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            this.logger.error(String.format("Cannot fetch quiz list for user: %s, page=%d, size=%d",
                                userId, page, size), ex);
            throw ex;
        }
    }

    @GetMapping("/api/v1/users/{userId}/assignedQuiz")
    public List<QuizDto> getUserAssignedQuizList(@PathVariable("userId") String userId,
                                  @RequestParam(required = false) Integer page,
                                  @RequestParam(required = false) Integer size) throws Exception {
        try{
            this.logger.debug(String.format("Getting all assigned quiz list for user: %s. page: %d size: %d",
                    userId, page, size));

            if(!AppUtils.isPaginationParamsValid(page, size)){
                throw new IllegalOperationException(
                        "In order to use pagination you must provide both page and size");
            }

            List<QuizDto> res = this.quizService.readAllAssignedToUser(userId,size,page)
                    .stream()
                    .map(quiz -> this.dtoMapper.convertQuizToDto(quiz))
                    .collect(Collectors.toList());

            this.logger.debug(String.format("Returning %d quiz for user: %s", res.size(), userId));

            return res;
        } catch (Exception ex){
            this.logger.error(String.format("Cannot fetch quiz list assigned to user: %s, page=%d, size=%d",
                    userId, page, size), ex);
            throw ex;
        }
    }
}
