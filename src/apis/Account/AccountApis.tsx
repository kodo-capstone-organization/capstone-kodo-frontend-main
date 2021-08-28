import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Account } from "../Entities/Account";
import { httpClient } from "../HttpClient/HttpClient";
import { LoginResponse } from "../Entities/Login";

const FormData = require('form-data');

export async function login(username: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/account/login',
        payload: formData
    }

    return httpClient.post<FormData, LoginResponse>(postParameters)
}

export async function getAllAccounts(): Promise<Account[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: '/account/getAllAccounts'
    }

    return httpClient.get<undefined, Account[]>(getParameters)
}