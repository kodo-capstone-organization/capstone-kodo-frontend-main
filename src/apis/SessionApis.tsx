import { transformToBlob } from "../utils/BlobCreatorHelper";
import { CreateSessionReq, InvitedSessionResp } from "../entities/Session";
import { httpClient } from "./HttpClientApis/HttpClient";
import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";

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

export async function getSessionBySessionId(sessionId: string, userId: number) {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/kodoSession/getSessionBySessionId/${sessionId}&${userId}`
    }

    return httpClient.get<undefined, InvitedSessionResp>(getParameters, true);
}

export async function endSession(sessionId: string) {
    const deleteParameters: IHttpClientRequestParameters<undefined> = {
        url: `/kodoSession/endSession/${sessionId}`
    }

    return httpClient.delete<undefined, undefined>(deleteParameters, true);
}

export async function fetchGithubFile(githubUrl: string) {
    const urlParameters = githubUrl.replace("https://github.com/", "").split("/");
    if (urlParameters.length < 3) return; // invalid github url

    const repo = urlParameters[0];
    const branch = urlParameters[1];

    // Remove '/blob' from url string
    const remaining = urlParameters.slice(3).join("/")

    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `https://raw.githubusercontent.com/${repo}/${branch}/${remaining}`
    }
    
    return httpClient.getExternalUrl<undefined, string>(getParameters);
}
