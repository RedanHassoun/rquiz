package com.raiseup.rquiz.common;

import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.models.*;
import com.raiseup.rquiz.models.db.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DtoMapper {
    private ModelMapper modelMapper;

    public DtoMapper(ModelMapper modelMapper){
        this.modelMapper = modelMapper;
    }

    public QuizDto convertQuizToDto(Quiz quiz) {
        QuizDto quizDto = this.modelMapper.map(quiz, QuizDto.class);
        Set<QuizAnswerDto> answers = new HashSet<>();

        if(quiz.getAnswers() != null){
            for(QuizAnswer quizAnswer : quiz.getAnswers()){
                QuizAnswerDto quizAnswerDto = this.convertQuizAnswerToDto(quizAnswer);
                answers.add(quizAnswerDto);
            }
        }
        quizDto.setAnswers(answers);
        quizDto.setCreator(this.convertUserToDto(quiz.getCreator()));
        Set<UserDto> assignedUsers = new HashSet<>();
        if (quiz.getAssignedUsers() != null ) {
            for(User user : quiz.getAssignedUsers()) {
                assignedUsers.add(this.convertUserToDto(user));
            }
        }
        quizDto.setAssignedUsers(assignedUsers);

        return quizDto;
    }

    public Quiz convertQuizDtoToEntity(QuizDto quizDto) {
        Quiz quiz = this.modelMapper.map(quizDto, Quiz.class);
        Set<QuizAnswerDto> quizAnswersDto = quizDto.getAnswers();
        List<QuizAnswer> quizAnswers = quizAnswersDto.stream()
                .map(quizAnswerDto -> this.convertQuizAnswerDtoToEntity(quizAnswerDto))
                .collect(Collectors.toList());

        for(QuizAnswer quizAnswer : quizAnswers) {
            quiz.addQuizAnswer(quizAnswer);
        }

        Set<UserDto> assignedUsers = quizDto.getAssignedUsers();
        Set<User> users = assignedUsers.stream()
                .map(userDto -> this.convertUserDtoToEntity(userDto))
                .collect(Collectors.toSet());

        User quizCreator = this.convertUserDtoToEntity(quizDto.getCreator());
        quiz.setCreator(quizCreator);
        quiz.setAssignedUsers(users);

        return quiz;
    }

    public QuizAnswerDto convertQuizAnswerToDto(QuizAnswer quizAnswer) {
        QuizAnswerDto quizAnswerDto = this.modelMapper.map(quizAnswer, QuizAnswerDto.class);

        if(quizAnswer.getQuiz() != null) {
            quizAnswerDto.setQuizId(quizAnswer.getQuiz().getId());
        }

        quizAnswerDto.setIsCorrect(null); // Never return the quiz correct state to the client
        return quizAnswerDto;
    }

    public QuizAnswer convertQuizAnswerDtoToEntity(QuizAnswerDto quizDto) {
        QuizAnswer quizAnswer = this.modelMapper.map(quizDto, QuizAnswer.class);
        return quizAnswer;
    }

    public UserAnswerDto convertUserAnswerToDto(UserAnswer userAnswer) {
        UserAnswerDto userAnswerDto = new UserAnswerDto();
        userAnswerDto.setId(userAnswer.getId());
        userAnswerDto.setAnswerId(userAnswer.getQuizAnswer().getId());
        userAnswerDto.setUserId(userAnswer.getUser().getId());
        QuizAnswer quizAnswer = userAnswer.getQuizAnswer();
        Quiz quiz = quizAnswer.getQuiz();
        if (quiz.getCorrectAnswer() == null) {
            throw new NullPointerException(String.format("Quiz %s has no correct answer", quiz.getId()));
        }
        userAnswerDto.setCorrectAnswerId(quiz.getCorrectAnswer().getId());
        return userAnswerDto;
    }

    public UserAnswer convertUserAnswerDtoToEntity(UserAnswerDto userAnswerDto){
        UserAnswer userAnswer = new UserAnswer();
        Quiz quiz = new Quiz();
        quiz.setId(userAnswerDto.getQuizId());

        User user = new User();
        user.setId(userAnswerDto.getUserId());
        userAnswer.setUser(user);

        QuizAnswer quizAnswer = new QuizAnswer();
        quizAnswer.setId(userAnswerDto.getAnswerId());
        userAnswer.setQuizAnswer(quizAnswer);

        return userAnswer;
    }

    public UserDto convertUserToDto(User user){
        UserDto userDto = this.modelMapper.map(user, UserDto.class);
        return userDto;
    }

    public User convertUserDtoToEntity(UserDto userDto){
        return this.modelMapper.map(userDto, User.class);
    }

    public User convertUpdateUserRequestTOUserEntity(UpdateUserRequestDto updateUserRequest) {
        return this.modelMapper.map(updateUserRequest, User.class);
    }

    public User convertRegisterRequestToUserEntity(RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());
        user.setEmail(registerRequest.getEmail());

        return user;
    }

    public AppNotificationMessage convertUserNotificationToDto(UserNotification userNotification) {
        AppNotificationMessage appNotificationMessage = this.modelMapper.map(userNotification,
                                                                            AppNotificationMessage.class);
        appNotificationMessage.setUserId(userNotification.getUser().getId());
        appNotificationMessage.setUsername(userNotification.getUser().getUsername());
        String[] targetUserIds = new String[1];
        targetUserIds[0] = userNotification.getTargetUser().getId();
        appNotificationMessage.setTargetUserIds(targetUserIds);

        return appNotificationMessage;
    }

    public UserNotification convertUserNotificationDtoToEntity(AppNotificationMessage appNotificationMessage) {
        UserNotification userNotification = this.modelMapper.map(appNotificationMessage,
                UserNotification.class);
        User user = new User();
        user.setId(appNotificationMessage.getUserId());
        user.setUsername(appNotificationMessage.getUsername());
        userNotification.setUser(user);

        User targetUser = new User();
        if (appNotificationMessage.getTargetUserIds() != null) {
            // Currently we support only one target user at a time
            targetUser.setId(appNotificationMessage.getTargetUserIds()[0]);
        } else {
            throw new IllegalArgumentException(
                    "Cannot convert notification to entity because the target user is not defined");
        }

        userNotification.setTargetUser(targetUser);

        return userNotification;
    }

}
