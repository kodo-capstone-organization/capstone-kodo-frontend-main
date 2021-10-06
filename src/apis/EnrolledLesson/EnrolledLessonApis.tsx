import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { EnrolledLesson } from "../Entities/EnrolledLesson";


export async function getEnrolledLesson(studentId: number, lessonId: number): Promise<EnrolledLesson> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledLesson/getEnrolledLessonByStudentIdAndLessonId/${studentId}/${lessonId}`
    }

    return httpClient.get<undefined, EnrolledLesson>(getParameters);
}

export async function getEnrolledLessonByEnrolledLessonId(enrolledLessonId: number): Promise<EnrolledLesson> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledLesson/getEnrolledLessonByEnrolledLessonId/${enrolledLessonId}`
    }

    return httpClient.get<undefined, EnrolledLesson>(getParameters);
}