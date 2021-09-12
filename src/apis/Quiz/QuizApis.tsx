import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { QuizWithStudentAttemptCountResp } from "../Entities/Quiz";
import { httpClient } from "../HttpClient/HttpClient";

export async function getAllQuizzesWithStudentAttemptCountByEnrolledLessonId(enrolledLessonId: number): Promise<QuizWithStudentAttemptCountResp[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/quiz/getAllQuizzesWithStudentAttemptCountByEnrolledLessonId/${enrolledLessonId}`
    }

    return httpClient.get<undefined, QuizWithStudentAttemptCountResp[]>(getParameters);
}