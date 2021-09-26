import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Multimedia } from "../Entities/Multimedia";
import { httpClient } from "../HttpClient/HttpClient";

export async function getMultimediaByMultimediaId(multimediaId: number): Promise<Multimedia> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/multimedia/getMultimediaByMultimediaId/${multimediaId}`
    }

    return httpClient.get<undefined, Multimedia>(getParameters);
}