import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Course, UpdateCourseReq } from "../Entities/Course";
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

    return httpClient.get<undefined, Course>(getParameters);
}

export async function getCourseByKeyword(keyword: string): Promise<Course[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getAllCoursesByKeyword/${keyword}`
    }

    return httpClient.get<undefined, Course[]>(getParameters)
}

export async function getCourseByTagTitle(tagTitle: string): Promise<Course[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getAllCoursesByTagTitle/${tagTitle}`
    }

    return httpClient.get<undefined, Course[]>(getParameters)
}


export async function createNewCourse(createNewCourseReq: CreateNewAccountReq, bannerPicture: File | null): Promise<Course> {
    const formData = new FormData();

    formData.append('course', transformToBlob(createNewCourseReq));
    if(bannerPicture !== null)
    {
        formData.append('bannerPicture', bannerPicture);
    }

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/course/createNewCourse',
        payload: formData
    }

    return httpClient.post<FormData, Course>(postParameters)
}

export async function getCourseToRecommend(accountId: number): Promise<Course[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getAllCoursesToRecommend/${accountId}`
    }

    return httpClient.get<undefined, Course[]>(getParameters)
}

export async function updateCourse(updateCourseReq: UpdateCourseReq, updatedBannerPicture: File | null): Promise<Course> {
    const formData = new FormData();

    formData.append('updateCourseReq', transformToBlob(updateCourseReq));
    if (updatedBannerPicture !== null) {
        formData.append('bannerPicture', updatedBannerPicture);
    }

    console.log(updateCourseReq)
    console.log(updatedBannerPicture)

    const putParameters: IHttpClientRequestParameters<FormData> = {
        url: '/course/updateCourse',
        payload: formData
    }

    return httpClient.put<FormData, Course>(putParameters)
}
