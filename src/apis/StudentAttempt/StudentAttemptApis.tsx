import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { StudentAttempt, CreateNewStudentAttemptReq } from "../Entities/StudentAttempt";
import { httpClient } from "../HttpClient/HttpClient";
import { transformToBlob } from "./../../utils/BlobCreator";
const FormData = require('form-data');

export async function getStudentAttemptByStudentAttemptId(studentAttemptId: number): Promise<StudentAttempt> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/studentAttempt/getStudentAttemptByStudentAttemptId/${studentAttemptId}`
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