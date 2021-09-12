import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { Tag } from "../Entities/Tag";

export async function getAllTags(): Promise<Tag[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: '/tag/getAllTags'
    }

    return httpClient.get<undefined, Tag[]>(getParameters)
}