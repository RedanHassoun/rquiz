export class AppConsts {
    public static readonly BASE_URL = 'http://localhost:3000';
    public static readonly FORM_DATA_FILE_UPLOAD_KEY = 'file';
    public static readonly FORM_DATA_FILE_DELETE_KEY = 'url';
    public static readonly KEY_USER_TOKEN = 'KEY_USER_TOKEN';
    public static readonly STOMP_ENDPOINT = '/rquiz-websocket-endpoint';

    // Error messages
    public static readonly SESSION_EXPIRED_ERROR = 'Session expired please login again';
}

export const ROUTE_NAMES = {
    MY_QUIZ_LIST: {
        name: 'my-quiz-list',
        display: 'My Quiz List'
    },
    MY_ASSIGNED_QUIZ_LIST: {
        name: 'my-assigned-quiz-list',
        display: 'Assigned To Me'
    },
    PEOPLE_LIST: {
        name: 'people',
        display: 'People'
    },
    QUIZ_LIST: {
        name: 'quiz-list',
        display: 'Home'
    },
    LOGIN: {
        name: 'login',
        display: 'Login'
    },
    REGISTER: {
        name: 'register',
        display: 'Register'
    },
    PROFILE: {
        name: `people/:id`,
        display: 'Profile'
    },
    LOGOUT: {
        name: `logout`,
        display: 'Logout'
    }
};
