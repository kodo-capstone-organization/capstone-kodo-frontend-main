import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Lesson } from "../Entities/Lesson";
import { httpClient } from "../HttpClient/HttpClient";

export async function getLessonByLessonId(lessonId: number): Promise<Lesson> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/lesson/getLessonByLessonId/${lessonId}`
    }

    return httpClient.get<undefined, Lesson>(getParameters);
}