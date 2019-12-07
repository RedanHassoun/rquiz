export class QuizAnswer {
    id: string;
    content: string;
    quizId: string;
    isCorrect: boolean;

    equalTo(quizAnswer: QuizAnswer): boolean {
        if (quizAnswer.content === this.content) {
            return true;
        }
        return false;
    }
}
