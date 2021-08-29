import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Account, CreateNewAccountReq } from "../Entities/Account";
import { httpClient } from "../HttpClient/HttpClient";
import { LoginResponse } from "../Entities/Login";
import { transformToBlob } from "./../../utils/BlobCreator"

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

export async function createNewAccount(createNewAccountReq: CreateNewAccountReq, displayPicture: File): Promise<Account> {
    const formData = new FormData();
    
    formData.append('account', transformToBlob(createNewAccountReq));
    formData.append('displayPicture', displayPicture);

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/account/createNewAccount',
        payload: formData
    }

    return httpClient.post<FormData, Account>(postParameters)
}