import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";
import { Course, RecommendedCoursesWithTags, ToggleCourseResp, UpdateCourseReq } from "../entities/Course";
import { httpClient } from "./HttpClientApis/HttpClient";
import { CreateNewCourseReq } from "../entities/Course";
import { transformToBlob } from "../utils/BlobCreatorHelper";

export async function getAllCourses(): Promise<Course[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: '/course/getAllCourses'
    }

    return httpClient.get<undefined, Course[]>(getParameters)
}

export async function getCourseByContentId(contentId: number): Promise<Course> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getCourseByContentId/${contentId}`
    }

    return httpClient.get<undefined, Course>(getParameters);
}

export async function getCourseByStudentAttemptId(studentAttemptId: number): Promise<Course> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getCourseByStudentAttemptId/${studentAttemptId}`
    }

    return httpClient.get<undefined, Course>(getParameters);
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

export async function toggleReviewRequestStatus(courseId: number, requestingAccountId: number): Promise<ToggleCourseResp> {
    const deleteParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/toggleReviewRequestStatus/${courseId}&${requestingAccountId}`
    }

    return httpClient.delete<undefined, ToggleCourseResp>(deleteParameters);
}

export async function getCourseWithoutEnrollmentByCourseId(courseId: number): Promise<Course> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getCourseWithoutEnrollmentByCourseId/${courseId}`
    }

    return httpClient.get<undefined, Course>(getParameters);
}

export async function getCourseWithoutEnrollmentByCourseIdAndAccountId(courseId: number, accountId: number): Promise<Course> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getCourseWithoutEnrollmentByCourseIdAndAccountId/${courseId}/${accountId}`
    }

    return httpClient.get<undefined, Course>(getParameters);
}

export async function getCourseRatingByCourseId(courseId: number): Promise<number> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/getCourseRatingByCourseId/${courseId}`
    }

    return httpClient.get<undefined, number>(getParameters);
}

export async function isTutorByCourseIdAndAccountId(courseId: number, accountId: number): Promise<boolean> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/isTutorByCourseIdAndAccountId/${courseId}/${accountId}`
    }

    return httpClient.get<undefined, boolean>(getParameters);
}

export async function isStudentByCourseIdAndAccountId(courseId: number, accountId: number): Promise<boolean> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/course/isStudentByCourseIdAndAccountId/${courseId}/${accountId}`
    }

    return httpClient.get<undefined, boolean>(getParameters);
}
