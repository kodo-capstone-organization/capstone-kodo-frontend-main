import { Quiz } from "./Quiz";
import { QuizQuestionOption } from "./QuizQuestionOption";

export interface QuizQuestion {
    quizQuestionId: (number | null),
    content: string,
    questionType: (QuestionType | string),
    marks: number,
    quiz: Quiz,
    quizQuestionOptions: QuizQuestionOption[]
}

export enum QuestionType {
    MCQ = "MCQ",
    TF = "TF",
    MATCHING = "MATCHING"
}