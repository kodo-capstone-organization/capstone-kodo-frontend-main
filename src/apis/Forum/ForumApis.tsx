import { IHttpClientRequestParameters } from "../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { transformToBlob } from "./../../utils/BlobCreator";
import { ForumCategory, CreateNewForumCategoryReq, UpdateForumCategoryReq } from "../Entities/ForumCategory";


export async function getForumCategoryByCourseId(courseId: number): Promise<ForumCategory[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumCategory/getForumCategoryByCourseId/${courseId}`
    }
    return httpClient.get<undefined, ForumCategory[]>(getParameters)
}

export async function updateForumCategory(updateForumCategoryReq: UpdateForumCategoryReq): Promise<ForumCategory> {
    const formData = new FormData();

    formData.append('forumCategory', transformToBlob(updateForumCategoryReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/forumCategory/updateForumCategory',
        payload: formData
    }

    return httpClient.put<FormData, ForumCategory>(postParameters)
}

export async function createNewForumCategory(createNewForumCategoryReq: CreateNewForumCategoryReq): Promise<ForumCategory> {
    const formData = new FormData();

    formData.append('forumCategory', transformToBlob(createNewForumCategoryReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/forumCategory/createNewForumCategory',
        payload: formData
    }

    return httpClient.post<FormData, ForumCategory>(postParameters)
}

export async function deleteForumCategory(forumCategoryId: number): Promise<boolean> {
    const deleteParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumCategory/deleteForumCategory/${forumCategoryId}`
    }

    return httpClient.delete<undefined, boolean>(deleteParameters);
}
