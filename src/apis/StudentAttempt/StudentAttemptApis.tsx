import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { StudentAttempt, GetNumberOfStudentAttemptsLeftReq } from "../Entities/StudentAttempt";
import { httpClient } from "../HttpClient/HttpClient";
;

export async function getNumberOfStudentAttemptsLeft(accountId: number, quizId: number): Promise<number> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/studentAttempt/getNumberOfStudentAttemptsLeft/${accountId}&${quizId}`
    }

    return httpClient.get<undefined, number>(getParameters);
}
