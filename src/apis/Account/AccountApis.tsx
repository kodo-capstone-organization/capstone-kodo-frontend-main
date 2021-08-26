import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Account } from "../Entities/Account";
import { httpClient } from "../HttpClient/HttpClient";

export async function getAllAccounts(): Promise<Account[]> {
    const getParameters: IHttpClientRequestParameters<Account[]> = {
        url: '/account/getAllAccounts'
    }

    return httpClient.get<Account[]>(getParameters)
}