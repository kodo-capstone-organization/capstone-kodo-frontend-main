import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";
import { StudentAttempt, CreateNewStudentAttemptReq } from "../Entities/StudentAttempt";
import { httpClient } from "./HttpClientApis/HttpClient";
import { transformToBlob } from "../utils/BlobCreator";
const FormData = require('form-data');

export async function getStudentAttemptByStudentAttemptIdAndAccountId(studentAttemptId: number, accountId: number): Promise<StudentAttempt> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/studentAttempt/getStudentAttemptByStudentAttemptIdAndAccountId/${studentAttemptId}/${accountId}`
    }

    return httpClient.get<undefined, StudentAttempt>(getParameters);
}

export async function createNewStudentAttempt(createNewStudentAttemptReq: CreateNewStudentAttemptReq): Promise<StudentAttempt> {
    const formData = new FormData();

    formData.append('createNewStudentAttemptReq', transformToBlob(createNewStudentAttemptReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/studentAttempt/createNewStudentAttempt',
        payload: formData
    }

    return httpClient.post<FormData, StudentAttempt>(postParameters)
}