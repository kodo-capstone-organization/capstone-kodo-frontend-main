import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { httpClient } from "../HttpClient/HttpClient";
import { EnrolledCourse } from "../Entities/EnrolledCourse";

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
