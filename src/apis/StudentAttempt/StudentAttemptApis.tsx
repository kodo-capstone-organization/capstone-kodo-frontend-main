import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { StudentAttempt, GetNumberOfStudentAttemptsLeftReq } from "../Entities/StudentAttempt";
import { httpClient } from "../HttpClient/HttpClient";
import { transformToBlob } from "./../../utils/BlobCreator";
const FormData = require('form-data');

export async function getNumberOfStudentAttemptsLeft(getNumberOfStudentAttemptsLeftReq: GetNumberOfStudentAttemptsLeftReq): Promise<number> {
    const formData = new FormData();

    formData.append('account', transformToBlob(getNumberOfStudentAttemptsLeftReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/studentAttempt/getNumberOfStudentAttemptsLeft',
        payload: formData
    }

    return httpClient.get<FormData, number>(postParameters)
}
