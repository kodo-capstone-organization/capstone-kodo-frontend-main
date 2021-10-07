import { transformToBlob } from "../../utils/BlobCreator";
import { CreateSessionReq, InvitedSessionResp } from "../Entities/Session";
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

export async function getInvitedSessions(userId: number) {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/kodoSession/getInvitedSessions/${userId}`
    }

    return httpClient.get<undefined, InvitedSessionResp[]>(getParameters, true);
}