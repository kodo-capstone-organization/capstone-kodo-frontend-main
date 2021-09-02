import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Course } from "../Entities/Course";
import { httpClient } from "../HttpClient/HttpClient";

export async function getAllCourses(): Promise<Course[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: '/course/getAllCourses'
    }

    return httpClient.get<undefined, Course[]>(getParameters)
}