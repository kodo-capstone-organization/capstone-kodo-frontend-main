import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Multimedia } from "../Entities/Multimedia";
import { httpClient } from "../HttpClient/HttpClient";
import { transformToBlob } from "./../../utils/BlobCreator";

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