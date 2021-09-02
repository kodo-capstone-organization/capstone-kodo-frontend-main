import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Course, CreateNewCourseReq } from "../Entities/Course";
import { httpClient } from "../HttpClient/HttpClient";

const FormData = require('form-data');

export async function getAllCourses(): Promise<Course[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: '/course/getAllCourses'
    }

    return httpClient.get<undefined, Course[]>(getParameters)
}