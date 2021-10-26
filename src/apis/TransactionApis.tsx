import { Transaction, TutorCourseEarningsResp } from "../Entities/Transaction"
import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters"
import { httpClient } from "./HttpClientApis/HttpClient";

export async function getAllPaymentsByAccountId(accountId: number): Promise<Transaction[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/transaction/getAllPaymentsByAccountId/${accountId}`
    }
    return httpClient.get<undefined, Transaction[]>(getParameters)
}

export async function getAllEarningsByAccountId(accountId: number): Promise<Transaction[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/transaction/getAllEarningsByAccountId/${accountId}`
    }
    return httpClient.get<undefined, Transaction[]>(getParameters)
}

export async function getCourseEarningsPageData(accountId: number): Promise<TutorCourseEarningsResp> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/transaction/getCourseEarningsPageDataByAccountId/${accountId}`
    }
    return httpClient.get<undefined, TutorCourseEarningsResp>(getParameters)
}