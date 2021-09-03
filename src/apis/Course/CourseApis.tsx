import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Course } from "../Entities/Course";
import { httpClient } from "../HttpClient/HttpClient";
import { CreateNewAccountReq } from "../Entities/Account";
import { transformToBlob } from "../../utils/BlobCreator";

export async function getAllCourses(): Promise<Course[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: '/course/getAllCourses'
    }

    return httpClient.get<undefined, Course[]>(getParameters)
}

export async function getCourseByCourseId(courseId: number): Promise<Course> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getCourseByCourseId/${courseId}`
    }

    return httpClient.get<undefined, Course>(getParameters)
}

export async function createNewCourse(createNewCourseReq: CreateNewAccountReq, bannerPicture: File): Promise<Course> {
    const formData = new FormData();

    formData.append('course', transformToBlob(createNewCourseReq));
    formData.append('bannerPicture', bannerPicture);

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/course/createNewCourse',
        payload: formData
    }

    return httpClient.post<FormData, Course>(postParameters)
}