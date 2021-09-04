import { QuizQuestion } from "./QuizQuestion";
import { StudentAttemptAnswer } from "./StudentAttemptAnswer";

export interface StudentAttemptQuestion {
    studentAttemptQuestionId: number,
    quizQuestion: QuizQuestion,
    studentAttemptAnswers: StudentAttemptAnswer[]
}