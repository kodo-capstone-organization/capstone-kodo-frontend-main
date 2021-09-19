import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { QuizWithStudentAttemptCountResp, Quiz } from "../Entities/Quiz";
import { httpClient } from "../HttpClient/HttpClient";

export async function getAllQuizzesWithStudentAttemptCountByEnrolledLessonId(enrolledLessonId: number): Promise<QuizWithStudentAttemptCountResp[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/quiz/getAllQuizzesWithStudentAttemptCountByEnrolledLessonId/${enrolledLessonId}`
    }

    return httpClient.get<undefined, QuizWithStudentAttemptCountResp[]>(getParameters);
}

export async function getQuizByQuizId(quizId: number): Promise<Quiz> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/quiz/getQuizByQuizId/${quizId}`
    }

    return httpClient.get<undefined, Quiz>(getParameters);
}