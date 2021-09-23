import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Lesson } from "../Entities/Lesson";
import { httpClient } from "../HttpClient/HttpClient";
import { transformToBlob } from "./../../utils/BlobCreator";

export async function getLessonByLessonId(lessonId: number): Promise<Lesson> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/lesson/getLessonByLessonId/${lessonId}`
    }

    return httpClient.get<undefined, Lesson>(getParameters);
}

export async function createNewLesson(courseId: number, name: string, description: string, sequence: number): Promise<Lesson> {
    const formData = new FormData();

    formData.append('courseId', transformToBlob(courseId));
    formData.append('name', name);
    formData.append('description', description);
    formData.append('sequence', transformToBlob(sequence));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/lesson/createNewLesson',
        payload: formData
    }

    return httpClient.post<FormData, Lesson>(postParameters)
}