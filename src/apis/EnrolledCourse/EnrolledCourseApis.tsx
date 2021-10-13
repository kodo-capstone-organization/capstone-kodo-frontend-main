import { IHttpClientRequestParameters } from "../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { EnrolledCourse, EnrolledCourseWithStudentResp } from "../Entities/EnrolledCourse";

export async function getEnrolledCourseByEnrolledCourseId(enrolledCourseId: number): Promise<EnrolledCourse> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledCourse/getEnrolledCourseByEnrolledCourseId/${enrolledCourseId}`
    }

    return httpClient.get<undefined, EnrolledCourse>(getParameters);
}

export async function getEnrolledCourseByEnrolledCourseIdAndAccountId(enrolledCourseId: number, accountId: number): Promise<EnrolledCourse> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledCourse/getEnrolledCourseByEnrolledCourseIdAndAccountId/${enrolledCourseId}/${accountId}`
    }

    return httpClient.get<undefined, EnrolledCourse>(getParameters);
}

export async function getEnrolledCourseByStudentIdAndCourseId(studentId: number, courseId: number): Promise<EnrolledCourse> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledCourse/getEnrolledCourseByStudentIdAndCourseId/${studentId}/${courseId}`
    }

    return httpClient.get<undefined, EnrolledCourse>(getParameters);
}

export async function setCourseRatingByEnrolledCourseId(enrolledCourseId: number, courseRating: number): Promise<EnrolledCourse> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledCourse/setCourseRatingByEnrolledCourseId/${enrolledCourseId}/${courseRating}`
    }

    return httpClient.get<undefined, EnrolledCourse>(getParameters);
}

export async function getEnrolledCoursesWithStudentCompletion(courseId: number): Promise<EnrolledCourseWithStudentResp[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/enrolledCourse/getEnrolledCoursesWithStudentCompletion/${courseId}`
    }

    return httpClient.get<undefined, EnrolledCourseWithStudentResp[]>(getParameters);
}




