import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { EnrolledLesson } from "../Entities/EnrolledLesson";
import { EnrolledLessonWithStudentName } from "../Entities/EnrolledLesson";


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