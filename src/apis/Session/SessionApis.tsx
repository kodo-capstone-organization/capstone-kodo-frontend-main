import { transformToBlob } from "../../utils/BlobCreator";
import { CreateSessionReq } from "../Entities/Session";
import { httpClient } from "../HttpClient/HttpClient";
import { IHttpClientRequestParameters } from "../HttpClient/IHttpClientRequestParameters";

export async function createSession(createSessionReq: CreateSessionReq): Promise<string> {
    const formData = new FormData();
    formData.append('createSessionReq', transformToBlob(createSessionReq));
    
    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/kodoSession/createSession',
        payload: formData
    }

    return httpClient.post<FormData, string>(postParameters, true);
}