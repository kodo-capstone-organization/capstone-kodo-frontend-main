import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { QuizWithStudentAttemptCountResp, Quiz, UpdateQuizReq } from "../Entities/Quiz";
import { httpClient } from "../HttpClient/HttpClient";
import { transformToBlob } from "./../../utils/BlobCreator";


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

export async function updateQuizWithQuizQuestionsAndQuizQuestionOptions(updateQuizReq: UpdateQuizReq): Promise<Quiz> {
    const formData = new FormData();

    formData.append('quiz', transformToBlob(updateQuizReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/quiz/updateQuizWithQuizQuestionsAndQuizQuestionOptions',
        payload: formData
    }

    return httpClient.post<FormData, Quiz>(postParameters)
}