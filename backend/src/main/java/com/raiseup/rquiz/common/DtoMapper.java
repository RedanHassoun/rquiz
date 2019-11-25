package com.raiseup.rquiz.common;

import com.raiseup.rquiz.models.QuizAnswerDto;
import com.raiseup.rquiz.models.QuizDto;
import com.raiseup.rquiz.models.UserAnswerDto;
import com.raiseup.rquiz.models.UserDto;
import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.QuizAnswer;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.models.db.UserAnswer;
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
                QuizAnswerDto quizAnswerDto = this.modelMapper.map(quizAnswer, QuizAnswerDto.class);
                answers.add(quizAnswerDto);
            }
        }
        quizDto.setAnswers(answers);
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
        
        return quiz;
    }

    public QuizAnswerDto convertQuizAnswerToDto(QuizAnswer quizAnswer) {
        QuizAnswerDto quizAnswerDto = this.modelMapper.map(quizAnswer, QuizAnswerDto.class);

        if(quizAnswer.getQuiz() != null) {
            quizAnswerDto.setQuizId(quizAnswer.getQuiz().getId());
        }
        return quizAnswerDto;
    }

    public QuizAnswer convertQuizAnswerDtoToEntity(QuizAnswerDto quizDto) {
        QuizAnswer quizAnswer = this.modelMapper.map(quizDto, QuizAnswer.class);
        return quizAnswer;
    }

    public UserAnswerDto convertUserAnswerToDto(UserAnswer userAnswer) {
        UserAnswerDto userAnswerDto = new UserAnswerDto();
        userAnswerDto.setId(userAnswer.getId());
        userAnswerDto.setQuizId(userAnswer.getQuiz().getId());
        userAnswerDto.setAnswerId(userAnswer.getQuizAnswer().getId());
        userAnswerDto.setUserId(userAnswer.getUser().getId());

        return userAnswerDto;
    }

    public UserAnswer convertUserAnswerDtoToEntity(UserAnswerDto userAnswerDto){
        UserAnswer userAnswer = new UserAnswer();
        Quiz quiz = new Quiz();
        quiz.setId(userAnswerDto.getQuizId());
        userAnswer.setQuiz(quiz);

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
        userDto.setPassword(null);
        return userDto;
    }

    public User convertUserDtoToEntity(UserDto userDto){
        return this.modelMapper.map(userDto, User.class);
    }
}
