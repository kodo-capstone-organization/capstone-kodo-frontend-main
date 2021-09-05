import { Quiz } from "./Quiz";

export interface StudentAttempt {
    studentAttemptId: number,
    dateTimeOfAttempt: Date,
    dateTimeOfCompletion: Date,
    quiz: Quiz
}