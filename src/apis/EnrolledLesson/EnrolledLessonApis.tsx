import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { EnrolledLesson } from "../Entities/EnrolledLesson";


export async function getEnrolledLesson(accountId: number, lessonId: number): Promise<EnrolledLesson> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/account/getAccountByAccountId/${accountId}`
    }

    return httpClient.get<undefined, EnrolledLesson>(getParameters);
}