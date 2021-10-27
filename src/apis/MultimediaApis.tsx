import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";
import { Multimedia } from "../entities/Multimedia";
import { httpClient } from "./HttpClientApis/HttpClient";
import { transformToBlob } from "../utils/BlobCreator";

export async function addNewMultimediaToLesson(lessonId: number, name: string, description: string, file: File): Promise<Multimedia> {
    const formData = new FormData();

    formData.append('lessonId', transformToBlob(lessonId));
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/multimedia/addNewMultimediaToLesson',
        payload: formData
    }

    return httpClient.post<FormData, Multimedia>(postParameters)
}

export async function deleteMultimediasFromLesson(lessonId: number, contentIds: number[]): Promise<boolean> {
    const formData = new FormData();

    formData.append('lessonId', transformToBlob(lessonId));
    formData.append('contentIds', transformToBlob(contentIds));

    const deleteParamaters: IHttpClientRequestParameters<FormData> = {
        url: `/multimedia/deleteMultimediasFromLesson`,
        payload: formData
    }

    return httpClient.delete<FormData, boolean>(deleteParamaters);
}

export async function updateMultimedia(multimediaId: number, name: string, description: string, file: File): Promise<Multimedia> {
    const formData = new FormData();

    formData.append('multimediaId', transformToBlob(multimediaId));
    formData.append('name', name);
    formData.append('description', description);

    if (file.size !== 0) formData.append('file', file);

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/multimedia/updateMultimedia',
        payload: formData
    }

    return httpClient.post<FormData, Multimedia>(postParameters)   
}

export async function getMultimediaByMultimediaId(multimediaId: number): Promise<Multimedia> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/multimedia/getMultimediaByMultimediaId/${multimediaId}`
    }

    return httpClient.get<undefined, Multimedia>(getParameters);
}