import { httpClient } from "../HttpClient/HttpClient";
import { IHttpClientRequestParameters } from "../HttpClient/IHttpClientRequestParameters";

export async function createSession(sessionName: string): Promise<string> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/kodoSession/createSession/${sessionName}`
    }

    return httpClient.get<undefined, string>(getParameters, true);
}