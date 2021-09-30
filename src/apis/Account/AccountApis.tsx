import { IHttpClientRequestParameters } from "./../HttpClient/IHttpClientRequestParameters";
import { Account, CreateNewAccountReq, UpdateAccountReq, UpdateAccountPasswordReq } from "../Entities/Account";
import { httpClient } from "../HttpClient/HttpClient";
import { transformToBlob } from "./../../utils/BlobCreator";
import { DeactivateAccountResponse } from "../Entities/Deactivate";
const FormData = require('form-data');

export async function login(username: string, password: string): Promise<Account> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/account/login',
        payload: formData
    }

    return httpClient.post<FormData, Account>(postParameters)
}

export async function getAllAccounts(): Promise<Account[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: '/account/getAllAccounts'
    }

    return httpClient.get<undefined, Account[]>(getParameters)
}

export async function getAccountByQuizId(quizId: number): Promise<Account[]> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/account/getAccountByQuizId/${quizId}`
    }

    return httpClient.get<undefined, Account[]>(getParameters)
}

export async function createNewAccount(createNewAccountReq: CreateNewAccountReq, displayPicture: File | null): Promise<Account> {
    const formData = new FormData();

    formData.append('account', transformToBlob(createNewAccountReq));
    if (displayPicture !== null) {
        formData.append('displayPicture', displayPicture);
    }

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/account/createNewAccount',
        payload: formData
    }

    return httpClient.post<FormData, Account>(postParameters)
}

export async function getMyAccount(accountId: number): Promise<Account> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/account/getAccountByAccountId/${accountId}`
    }

    return httpClient.get<undefined, Account>(getParameters);
}

export async function deactivateAccount(deactivatingAccountId: number, requestingAccountId: number): Promise<DeactivateAccountResponse> {
    const deleteParameters: IHttpClientRequestParameters<undefined> = {
        url: `/account/deactivateAccount/${deactivatingAccountId}&${requestingAccountId}`
    }

    return httpClient.delete<undefined, DeactivateAccountResponse>(deleteParameters);
}

export async function reactivateAccount(reactivatingAccountId: number, requestingAccountId: number): Promise<DeactivateAccountResponse> {
    const deleteParameters: IHttpClientRequestParameters<undefined> = {
        url: `/account/reactivateAccount/${reactivatingAccountId}&${requestingAccountId}`
    }

    return httpClient.delete<undefined, DeactivateAccountResponse>(deleteParameters);
}

export async function getAccountByEnrolledCourseId(enrolledCourseId: number): Promise<Account> {
    const getParameters: IHttpClientRequestParameters<undefined> = {
        url: `/account/getAccountByEnrolledCourseId/${enrolledCourseId}`
    }

    return httpClient.get<undefined, Account>(getParameters);
}

export async function updateAccount(updateAccountReq: UpdateAccountReq, displayPictureFile: File): Promise<Account> {
    const formData = new FormData();

    formData.append('account', transformToBlob(updateAccountReq));
    // Check whether it's an empty file
    if (displayPictureFile.size !== 0) {
        formData.append('displayPicture', displayPictureFile);
    }

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/account/updateAccount',
        payload: formData
    }

    return httpClient.put<FormData, Account>(postParameters)
}

export async function updateAccountPassword(updateAccountPasswordReq: UpdateAccountPasswordReq): Promise<Account> {
    const formData = new FormData();

    formData.append('updateAccountPasswordReq', transformToBlob(updateAccountPasswordReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/account/updateAccountPassword',
        payload: formData
    }

    return httpClient.put<FormData, Account>(postParameters)
}