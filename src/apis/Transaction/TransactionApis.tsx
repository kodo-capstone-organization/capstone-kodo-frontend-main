import { Transaction } from "../Entities/Transaction"
import { IHttpClientRequestParameters } from "../HttpClient/IHttpClientRequestParameters"
import { httpClient } from "../HttpClient/HttpClient";

export async function getAllPaymentsByAccountId(accountId: number): Promise<Transaction[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/transaction/getAllPaymentsByAccountId/${accountId}`
    }
    return httpClient.get<undefined, Transaction[]>(getParameters)
}