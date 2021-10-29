import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";
import { httpClient } from "./HttpClientApis/HttpClient";
import { transformToBlob } from "../utils/BlobCreatorHelper";
import { ForumCategory, CreateNewForumCategoryReq, UpdateForumCategoryReq } from "../entities/ForumCategory";
import { ForumThread, CreateNewForumThreadReq } from "../entities/ForumThread";
import { ForumPost, CreateNewForumPostReq, CreateNewForumPostReplyReq, ForumPostWithRepliesResp, UpdateForumPostReq } from "../entities/ForumPost";

// FORUM CATEGORY //

export async function createNewForumCategory(createNewForumCategoryReq: CreateNewForumCategoryReq): Promise<ForumCategory> {
    const formData = new FormData();

    formData.append('forumCategory', transformToBlob(createNewForumCategoryReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/forumCategory/createNewForumCategory',
        payload: formData
    }

    return httpClient.post<FormData, ForumCategory>(postParameters)
}

export async function getAllForumCategoriesByCourseId(courseId: number): Promise<ForumCategory[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumCategory/getAllForumCategoriesByCourseId/${courseId}`
    }
    return httpClient.get<undefined, ForumCategory[]>(getParameters)
}

export async function getAllForumCategoriesWithForumThreadsOnlyByCourseId(courseId: number): Promise<ForumCategory[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumCategory/getAllForumCategoriesWithForumThreadsOnlyByCourseId/${courseId}`
    }
    return httpClient.get<undefined, ForumCategory[]>(getParameters)
}

export async function getForumCategoryByForumCategoryId(forumCategoryId: number): Promise<ForumCategory> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumCategory/getForumCategoryByForumCategoryId/${forumCategoryId}`
    }
    return httpClient.get<undefined, ForumCategory>(getParameters);
}

export async function getForumCategoryByForumCategoryIdAndCourseId(forumCategoryId: number, courseId: number): Promise<ForumCategory> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumCategory/getForumCategoryByForumCategoryIdAndCourseId/${forumCategoryId}/${courseId}`
    }
    return httpClient.get<undefined, ForumCategory>(getParameters);
}

export async function getForumCategoryWithForumThreadsOnlyByForumCategoryId(forumCategoryId: number): Promise<ForumCategory> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumCategory/getForumCategoryWithForumThreadsOnlyByForumCategoryId/${forumCategoryId}`
    }
    return httpClient.get<undefined, ForumCategory>(getParameters)
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

export async function deleteForumCategory(forumCategoryId: number): Promise<boolean> {
    const deleteParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumCategory/deleteForumCategory/${forumCategoryId}`
    }

    return httpClient.delete<undefined, boolean>(deleteParameters);
}

// FORUM THREAD //

export async function createNewForumThread(createNewForumThreadReq: CreateNewForumThreadReq): Promise<ForumThread> {
    const formData = new FormData();

    formData.append('forumThread', transformToBlob(createNewForumThreadReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/forumThread/createNewForumThread',
        payload: formData
    }

    return httpClient.post<FormData, ForumThread>(postParameters)
}

export async function getAllForumThreadsByForumCategoryId(forumCategoryId: number): Promise<ForumThread[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumThread/getAllForumThreadsByForumCategoryId/${forumCategoryId}`
    }
    return httpClient.get<undefined, ForumThread[]>(getParameters)
}

export async function getForumThreadByForumThreadId(forumThreadId: number): Promise<ForumThread> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumThread/getForumThreadByForumThreadId/${forumThreadId}`
    }
    return httpClient.get<undefined, ForumThread>(getParameters)
}

export async function getForumThreadByForumThreadIdAndCourseId(forumThreadId: number, courseId: number): Promise<ForumThread> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumThread/getForumThreadByForumThreadIdAndCourseId/${forumThreadId}/${courseId}`
    }
    return httpClient.get<undefined, ForumThread>(getParameters)
}

export async function deleteForumThread(forumThreadId: number): Promise<boolean> {
    const deleteParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumThread/deleteForumThread/${forumThreadId}`
    }

    return httpClient.delete<undefined, boolean>(deleteParameters);
}

// FORUM POST //

export async function createNewForumPost(createNewForumPostReq: CreateNewForumPostReq): Promise<ForumPost> {
    const formData = new FormData();

    formData.append('forumPost', transformToBlob(createNewForumPostReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/forumPost/createNewForumPost',
        payload: formData
    }

    return httpClient.post<FormData, ForumPost>(postParameters)
}

export async function createNewForumPostReply(createNewForumPostReplyReq: CreateNewForumPostReplyReq): Promise<ForumPost> {
    const formData = new FormData();

    formData.append('forumPostReply', transformToBlob(createNewForumPostReplyReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/forumPost/createNewForumPostReply',
        payload: formData
    }

    return httpClient.post<FormData, ForumPost>(postParameters)
}

export async function getAllForumPostsByForumThreadId(forumThreadId: number): Promise<ForumPost[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumPost/getAllForumPostsByForumThreadId/${forumThreadId}`
    }
    return httpClient.get<undefined, ForumPost[]>(getParameters)
}

export async function deleteForumPost(forumPostId: number): Promise<boolean> {
    const deleteParameters: IHttpClientRequestParameters<undefined> = {
        url: `/forumPost/deleteForumPost/${forumPostId}`
    }

    return httpClient.delete<undefined, boolean>(deleteParameters);
}

export async function updateForumPost(updateForumPostReq: UpdateForumPostReq): Promise<ForumPost> {
    const formData = new FormData();

    formData.append('forumPost', transformToBlob(updateForumPostReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/forumPost/updateForumPost',
        payload: formData
    }

    return httpClient.put<FormData, ForumPost>(postParameters)
}