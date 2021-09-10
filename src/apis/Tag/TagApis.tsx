import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { transformToBlob } from "./../../utils/BlobCreator";
import { Tag } from "../Entities/Tag";
const FormData = require('form-data');

export async function getAllTags(): Promise<Tag[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: '/tag/getAllTags'
    }

    return httpClient.get<undefined, Tag[]>(getParameters)
}