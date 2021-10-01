import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Course, RecommendedCoursesWithTags, ToggleCourseResp, UpdateCourseReq } from "../Entities/Course";
import { httpClient } from "../HttpClient/HttpClient";
import { CreateNewCourseReq } from "../Entities/Course";
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

export async function getCourseByEnrolledContentId(enrolledContentId: number): Promise<Course> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getCourseByEnrolledContentId/${enrolledContentId}`
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


export async function createNewCourse(createNewCourseReq: CreateNewCourseReq, bannerPicture: File | null): Promise<Course> {
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

export async function getCoursesToRecommend(accountId: number, limit: number): Promise<RecommendedCoursesWithTags> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getAllCoursesToRecommendWithLimitByAccountId/${accountId}/${limit}`
    }

    return httpClient.get<undefined, RecommendedCoursesWithTags>(getParameters)
}

export async function getAllCoursesThatArePopular(): Promise<Course[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getAllCoursesThatArePopular/`
    }

    return httpClient.get<undefined, Course[]>(getParameters)
}

export async function updateCourse(updateCourseReq: UpdateCourseReq, updatedBannerPicture: File): Promise<Course> {
    const formData = new FormData();
    formData.append('updateCourseReq', transformToBlob(updateCourseReq));
    
    // Check whether it's an empty file
    if (updatedBannerPicture.size !== 0) {
        formData.append('bannerPicture', updatedBannerPicture);
    }

    const putParameters: IHttpClientRequestParameters<FormData> = {
        url: '/course/updateCourse',
        payload: formData
    }

    return httpClient.put<FormData, Course>(putParameters)
}

export async function toggleEnrollmentActiveStatus(courseId: number, requestingAccountId: number): Promise<ToggleCourseResp> {
    const deleteParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/toggleEnrollmentActiveStatus/${courseId}&${requestingAccountId}`
    }

    return httpClient.delete<undefined, ToggleCourseResp>(deleteParameters);
}

export async function getCourseWithoutEnrollmentByCourseId(courseId: number): Promise<Course> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getCourseWithoutEnrollmentByCourseId/${courseId}`
    }

    return httpClient.get<undefined, Course>(getParameters);
}