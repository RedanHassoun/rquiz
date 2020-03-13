export class AppConsts {
    public static readonly BASE_URL = 'http://localhost:3000';
    public static readonly FORM_DATA_FILE_UPLOAD_KEY = 'file';
    public static readonly FORM_DATA_FILE_DELETE_KEY = 'url';
    public static readonly KEY_USER_TOKEN = 'KEY_USER_TOKEN';
    public static readonly STOMP_ENDPOINT = '/rquiz-websocket-endpoint';

    // Routes
    public static readonly MY_QUIZ_LIST = 'my-quiz-list';
    public static readonly MY_QUIZ_LIST_DISPLAY = 'My Quiz List';
    public static readonly MY_ASSIGNED_QUIZ_LIST = 'my-assigned-quiz-list';
    public static readonly MY_ASSIGNED_QUIZ_LIST_DISPLAY = 'Assigned To Me';
    public static readonly PEOPLE_LIST = 'people';
    public static readonly PEOPLE_LIST_DISPLAY = 'People';

    // Error messages
    public static readonly SESSION_EXPIRED_ERROR = 'Session expired please login again';
}
