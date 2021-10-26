import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";
import { Lesson } from "../Entities/Lesson";
import { httpClient } from "./HttpClientApis/HttpClient";
import { transformToBlob } from "../utils/BlobCreator";

export async function getLessonByLessonId(lessonId: number): Promise<Lesson> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/lesson/getLessonByLessonId/${lessonId}`
    }

    return httpClient.get<undefined, Lesson>(getParameters);
}

export async function getLessonByEnrolledContentId(enrolledContentId: number): Promise<Lesson> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/lesson/getLessonByEnrolledContentId/${enrolledContentId}`
    }

    return httpClient.get<undefined, Lesson>(getParameters);
}

export async function getLessonByStudentAttemptId(studentAttemptId: number): Promise<Lesson> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/lesson/getLessonByStudentAttemptId/${studentAttemptId}`
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

export async function deleteLesson(lessonId: number): Promise<boolean> {
    const deleteParameters: IHttpClientRequestParameters<undefined> = {
        url: `/lesson/deleteLesson/${lessonId}`
    }

    return httpClient.delete<undefined, boolean>(deleteParameters);
}

export async function updateLesson(lessonId: number, name: string, description: string): Promise<Lesson> {
    const formData = new FormData();

    formData.append('lessonId', transformToBlob(lessonId));
    formData.append('name', name);
    formData.append('description', description);

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/lesson/updateLesson',
        payload: formData
    }

    return httpClient.post<FormData, Lesson>(postParameters);
}