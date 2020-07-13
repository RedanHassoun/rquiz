# RQuiz

RQuiz is a small social networking service that allows registered members to send quizzes to specific people or broadcast it as a public post. It allows users to track the posted quiz, see assigned quiz and get notifications on everything related to the quiz.

![alt text](https://rquiz-storage-bucket-mumbai.s3.ap-south-1.amazonaws.com/rquiz-to-do-git.gif)

## Technologies

- Java Spring boot for implementing the server side
- Angular for the UI
- Postgresql DB
- AWS S3 for file storage

## Main features:
* **Create quiz**<br/>
  The user can create quiz with multiple possible answers, the quiz can have an image and can be posted in the public feed or assigned to one or more users 
* **See latest quiz feed**<br/>
  All posted quiz are updated in real-time (using socket notifications) and shown in the app main page
* **See notifications for quiz updates**<br/>
  The user gets a notification when someone solves one of his posted quiz, or assigns him a quiz
* **See and track all posted quiz**<br/>
  The user can see the list of all the quiz that he posted, and get instant updates
* **See and track assigned quiz**<br/>
  The user can see the list of all the quiz assigned to him and have the ability to solve them
* **Search for people**<br/>
  The user can search for other people and see their profile details

