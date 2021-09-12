import { Content } from "./Content";
import { QuizQuestion } from "./QuizQuestion";
import { StudentAttempt } from "./StudentAttempt";

export interface Quiz extends Content {
    timeLimit: string, // Todo
    maxAttemptsPerStudent: number,
    quizQuestions: QuizQuestion[],
    studentAttempts: StudentAttempt[]
}

export interface QuizWithStudentAttemptCountResp {
    contentId: number,
    timeLimit: string,
    maxAttemptsPerStudent: number,
    studentAttemptCount: number
}