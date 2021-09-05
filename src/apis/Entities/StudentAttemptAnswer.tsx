import { QuizQuestionOption } from "./QuizQuestionOption";

export interface StudentAttemptAnswer {
    studentAttemptAnswerId: number,
    dateTimeOfAttempt: Date,
    marks: number,
    quizQuestionOption: QuizQuestionOption
}