package com.raiseup.rquiz.common;

public class AppConstants {
    private AppConstants() {
        throw new AssertionError();
    }
    public static final String ERROR_PAGINATION_PARAMS = "In order to use pagination you must provide both page and size";

    // Security
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String REGISTER_URL = "/api/v1/users/sign-up";
    public static final String LOGIN_URL = "/api/v1/users/login";
    public static final int TOKEN_EXPIRATION_IN_DAYS = 30;
    public static final String TOKEN_SECRET_KEY = "RQUIZ_TOKEN_SECRET";

    // Amazon AWS environment variable names
    public static final String AWS_BUCKET_NAME = "S3_BUCKET_NAME";
    public static final String AWS_ACCESS_KEY = "AWS_ACCESS_KEY_ID";
    public static final String AWS_SECRET_KEY = "AWS_SECRET_ACCESS_KEY";

    public static class DBConsts {
        private DBConsts() {
            throw new AssertionError();
        }
        public static final String USERS_TABLE_NAME = "app_user";
        public static final String TABLE_USER_QUIZ_ASSIGNMENT = "user_quiz_assignment";
        public static final String QUIZ_ANSWER_TABLE_NAME = "quiz_answer";
        public static final String QUIZ_TABLE_NAME = "quiz";
        public static final String USER_ANSWER_TABLE_NAME = "quiz_user_answer";
        public static final String USER_NOTIFICATION_TABLE_NAME = "user_notification";
        public static final String USER_ID = "id";
        public static final String QUIZ_ID = "id";
        public static final String QUIZ_ANSWER_ID = "id";

        // Field names
        public static final String QUIZ_CREATOR_FIELD = "creator";
        public static final String QUIZ_FIELD = "quiz";
        public static final String QUIZ_ASSIGNED_USERS_FIELD = "assignedUsers";
        public static final String USER_FIELD = "user";
        public static final String QUIZ_ANSWER_FIELD = "quizAnswer";
        public static final String CREATED_AT = "createdAt";
    }
}
