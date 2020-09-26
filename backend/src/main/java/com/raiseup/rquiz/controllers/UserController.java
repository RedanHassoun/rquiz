package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.common.AppConstants;
import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.common.DtoMapper;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.exceptions.UserNotFoundException;
import com.raiseup.rquiz.models.QuizDto;
import com.raiseup.rquiz.models.RegisterRequest;
import com.raiseup.rquiz.models.UpdateUserRequestDto;
import com.raiseup.rquiz.models.UserDto;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.UserService;
import com.raiseup.rquiz.services.UserValidationService;
import org.slf4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
import com.raiseup.rquiz.common.AppConstants.*;
import static com.raiseup.rquiz.common.AppConstants.HEADER_STRING;
import static com.raiseup.rquiz.common.AppConstants.TOKEN_PREFIX;

@RestController
@CrossOrigin
public class UserController {
    private Logger logger;
    private UserService usersService;
    private QuizService quizService;
    private UserValidationService userValidationService;
    private DtoMapper dtoMapper;

    public UserController(UserService usersService,
                          QuizService quizService,
                          UserValidationService userValidationService,
                          DtoMapper dtoMapper,
                          Logger logger) {
        this.usersService = usersService;
        this.quizService = quizService;
        this.dtoMapper = dtoMapper;
        this.userValidationService = userValidationService;
        this.logger = logger;
    }

    @GetMapping("/api/v1/users/all")
    public List<UserDto> getUsers(@RequestParam(required = false, value = "search") String search,
                                  @RequestParam(required = false) Integer page,
                                  @RequestParam(required = false) Integer size) throws Exception {
        try{
            if(!AppUtils.isPaginationParamsValid(page, size)){
                throw new IllegalOperationException(
                        "In order to use pagination you must provide both page and size");
            }
            if (search != null) {
                return this.usersService.search(search, size, page)
                        .stream()
                        .map(user -> this.dtoMapper.convertUserToDto(user))
                        .collect(Collectors.toList());
            }

            if (page != null &&  size != null) {
                return this.usersService.readAll(size, page)
                        .stream()
                        .map(user -> this.dtoMapper.convertUserToDto(user))
                        .collect(Collectors.toList());
            }
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

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody RegisterRequest loginRequest) throws Exception {
        try {
            Optional<List<String>> validations = this.userValidationService.validateLoginRequest(loginRequest);
            if(validations.isPresent()) {
                final String errorMsg = this.userValidationService.buildValidationMessage(validations.get());
                throw new IllegalOperationException(errorMsg);
            }

            final String token = this.usersService.login(loginRequest);
            if (token == null) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            return ResponseEntity.ok()
                    .headers(this.buildLoginResponseHeaders(token))
                    .build();
        } catch (Exception ex) {
            final String username = loginRequest != null ? loginRequest.getUsername() : null;
            this.logger.error(String.format("An error occurred while performing login for user: '%s'", username), ex);
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
                throw new IllegalOperationException(AppConstants.ERROR_PAGINATION_PARAMS);
            }

            HashMap<String, Object> queryParams = new HashMap<>();
            User creator = new User();
            creator.setId(userId);
            queryParams.put(DBConsts.QUIZ_CREATOR_FIELD, creator);
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

    private HttpHeaders buildLoginResponseHeaders(String token) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Access-Control-Expose-Headers", "Authorization");
        responseHeaders.set(HEADER_STRING, TOKEN_PREFIX + token);
        return responseHeaders;
    }
}
