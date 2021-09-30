import { IHttpClientRequestParameters } from "../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { EnrolledContent } from "../Entities/EnrolledContent";
import { transformToBlob } from "./../../utils/BlobCreator";

export async function setDateTimeOfCompletionOfEnrolledContentByAccountIdAndContentId(complete: boolean, accountId: number, contentId: number): Promise<EnrolledContent> {

    const formData = new FormData();

    let completeMultimediaReq = {
        complete: complete,
        accountId: accountId,
        contentId: contentId
    }

    formData.append('completeMultimediaReq', transformToBlob(completeMultimediaReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: `/enrolledContent/setDateTimeOfCompletionOfEnrolledContentByAccountIdAndContentId/`,
        payload: formData
    }

    return httpClient.post<FormData, EnrolledContent>(postParameters);
}