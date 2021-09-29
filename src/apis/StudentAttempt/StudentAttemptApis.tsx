import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { StudentAttempt } from "../Entities/StudentAttempt";
import { httpClient } from "../HttpClient/HttpClient";
const FormData = require('form-data');

export async function getStudentAttemptByStudentAttemptId(studentAttemptId: number): Promise<StudentAttempt> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/studentAttempt/getStudentAttemptByStudentAttemptId/${studentAttemptId}`
    }

    return httpClient.get<undefined, StudentAttempt>(getParameters);
}