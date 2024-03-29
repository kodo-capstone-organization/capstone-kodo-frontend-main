import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";
import { httpClient } from "./HttpClientApis/HttpClient";
import { EnrolledLesson } from "../entities/EnrolledLesson";
import { EnrolledLessonWithStudentName } from "../entities/EnrolledLesson";


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

export async function getEnrolledLessonByEnrolledLessonIdAndAccountId(enrolledLessonId: number, accountId: number): Promise<EnrolledLesson> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledLesson/getEnrolledLessonByEnrolledLessonIdAndAccountId/${enrolledLessonId}/${accountId}`
    }

    return httpClient.get<undefined, EnrolledLesson>(getParameters);
}

export async function getAllEnrolledLessonsByLessonId(lessonId: number): Promise<EnrolledLesson[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledLesson/getAllEnrolledLessonsByLessonId/${lessonId}`
    }

    return httpClient.get<undefined, EnrolledLesson[]>(getParameters);
}

export async function getAllEnrolledLessonsWithStudentNameByCourseIdAndLessonIdAndAccountId(courseId: number, lessonId: number, accountId: number): Promise<EnrolledLessonWithStudentName[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledLesson/getAllEnrolledLessonsWithStudentNameByCourseIdAndLessonIdAndAccountId/${courseId}/${lessonId}/${accountId}`
    }

    return httpClient.get<undefined, EnrolledLessonWithStudentName[]>(getParameters);
}