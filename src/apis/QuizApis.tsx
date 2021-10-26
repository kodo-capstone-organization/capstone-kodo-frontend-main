import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";
import { QuizWithStudentAttemptCountResp, Quiz, UpdateQuizReq } from "../Entities/Quiz";
import { httpClient } from "./HttpClientApis/HttpClient";
import { transformToBlob } from "../utils/BlobCreator";

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

export async function getQuizByQuizIdAndAccountId(quizId: number, accountId: number): Promise<Quiz> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/quiz/getQuizByQuizIdAndAccountId/${quizId}/${accountId}`
    }

    return httpClient.get<undefined, Quiz>(getParameters);
}

export async function getQuizByEnrolledContentIdAndAccountId(enrolledContentId: number, accountId: number): Promise<Quiz> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/quiz/getQuizByEnrolledContentIdAndAccountId/${enrolledContentId}/${accountId}`
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

export async function createNewBasicQuiz(lessonId: number, name: string, description: string, hours: number, minutes: number, maxAttemptsPerStudent: number): Promise<Quiz> {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('hours', transformToBlob(hours));
    formData.append('minutes', transformToBlob(minutes));
    formData.append('maxAttemptsPerStudent', transformToBlob(maxAttemptsPerStudent));
    formData.append('lessonId', transformToBlob(lessonId));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/quiz/createNewBasicQuiz',
        payload: formData
    }

    return httpClient.post<FormData, Quiz>(postParameters)
}

export async function deleteQuizzes(quizIds: number[]): Promise<boolean> {
    const formData = new FormData();

    formData.append('quizIds', transformToBlob(quizIds))
    
    const deleteParameters: IHttpClientRequestParameters<FormData> = {
        url: `/quiz/deleteQuizWithQuizQuestionsAndQuizQuestionOptionsByQuizId`,
        payload: formData
    }

    return httpClient.delete<FormData, boolean>(deleteParameters)
}