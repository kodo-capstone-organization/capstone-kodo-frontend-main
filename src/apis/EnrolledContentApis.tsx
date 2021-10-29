import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";
import { httpClient } from "./HttpClientApis/HttpClient";
import { EnrolledContent } from "../entities/EnrolledContent";
import { transformToBlob } from "../utils/BlobCreatorHelper";

export async function setDateTimeOfCompletionOfEnrolledContentByEnrolledContentId(complete: boolean, enrolledContentId: number): Promise<EnrolledContent> {

    const formData = new FormData();

    let completeMultimediaReq = {
        complete: complete,
        enrolledContentId: enrolledContentId
    }

    formData.append('completeMultimediaReq', transformToBlob(completeMultimediaReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: `/enrolledContent/setDateTimeOfCompletionOfEnrolledContentByEnrolledContentId/`,
        payload: formData
    }

    return httpClient.post<FormData, EnrolledContent>(postParameters);
}

export async function getEnrolledContentByEnrolledContentId(enrolledContentId: number): Promise<EnrolledContent> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledContent/getEnrolledContentByEnrolledContentId/${enrolledContentId}`
    }

    return httpClient.get<undefined, EnrolledContent>(getParameters)
}

export async function getEnrolledContentByEnrolledContentIdAndAccountId(enrolledContentId: number, accountId: number): Promise<EnrolledContent> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledContent/getEnrolledContentByEnrolledContentIdAndAccountId/${enrolledContentId}/${accountId}`
    }

    return httpClient.get<undefined, EnrolledContent>(getParameters)
}