import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { QuizQuestion } from "../Entities/QuizQuestion";

export async function getAllQuizQuestionsByQuizId(quizId: number): Promise<QuizQuestion[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/quizQuestion/getAllQuizQuestionsByQuizId/${quizId}`
    }

    return httpClient.get<undefined, QuizQuestion[]>(getParameters);
}

export async function getAllQuizQuestionsByTutorId(tutorId: number): Promise<QuizQuestion[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/quizQuestion/getAllQuizQuestionsByTutorId/${tutorId}`
    }

    return httpClient.get<undefined, QuizQuestion[]>(getParameters);
}

export async function getQuizQuestionByQuizQuestionId(quizQuestionId: number): Promise<QuizQuestion> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/quizQuestion/getQuizQuestionByQuizQuestionId/${quizQuestionId}`
    }

    return httpClient.get<undefined, QuizQuestion>(getParameters);
}