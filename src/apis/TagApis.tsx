import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";
import { httpClient } from "./HttpClientApis/HttpClient";
import { Tag } from "../Entities/Tag";

export async function getAllTags(): Promise<Tag[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: '/tag/getAllTags'
    }

    return httpClient.get<undefined, Tag[]>(getParameters)
}