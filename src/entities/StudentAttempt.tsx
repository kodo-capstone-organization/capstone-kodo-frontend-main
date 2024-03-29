import { Quiz } from "./Quiz";
import { StudentAttemptQuestion } from "./StudentAttemptQuestion";

export interface StudentAttempt {
    studentAttemptId: number,
    dateTimeOfAttempt: Date,
    studentAttemptQuestions: StudentAttemptQuestion[],
    quiz: Quiz
}

export interface GetNumberOfStudentAttemptsLeftReq {
    accountId: number,
    quizId: number,
}

export interface CreateNewStudentAttemptReq {
    enrolledContentId: number,
    quizQuestionOptionIdLists: number[][][]
}