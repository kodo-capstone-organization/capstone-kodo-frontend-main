import { Content } from "./Content";
import { QuizQuestion } from "./QuizQuestion";
import { StudentAttempt } from "./StudentAttempt";

export interface Quiz extends Content {
    timeLimit: string, // Todo
    maxAttemptPerStudent: number,
    quizQuestions: QuizQuestion[],
    studentAttempts: StudentAttempt[]
}