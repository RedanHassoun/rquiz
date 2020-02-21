package com.raiseup.rquiz.common;

public class AppConstants {
    public static final String ERROR_PAGINATION_PARAMS = "In order to use pagination you must provide both page and size";

    public static class DBConsts {
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
    }
}
