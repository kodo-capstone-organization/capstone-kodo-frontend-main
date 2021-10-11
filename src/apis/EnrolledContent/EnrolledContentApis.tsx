import { IHttpClientRequestParameters } from "../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { EnrolledContent } from "../Entities/EnrolledContent";
import { transformToBlob } from "./../../utils/BlobCreator";

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