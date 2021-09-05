import { httpClient } from '../HttpClient/HttpClient';
import { IHttpClientRequestParameters } from '../HttpClient/IHttpClientRequestParameters';
import { StripeAccountResponse, StripeSessionResponse, StripePaymentReq } from './../Entities/Stripe';
import { transformToBlob } from './../../utils/BlobCreator'

const FormData = require('form-data');

export async function createStripeAccount(accountId: number): Promise<StripeAccountResponse> {
    const formData = new FormData();
    formData.append('accountId', accountId);

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/stripe/createStripeAccount',
        payload: formData
    }

    return httpClient.post<FormData, StripeAccountResponse>(postParameters);
}

export async function createStripeSession(stripePaymentReq: StripePaymentReq): Promise<StripeSessionResponse> {
    const formData = new FormData();
    formData.append('stripePaymentReq', transformToBlob(stripePaymentReq));

    const postParameters: IHttpClientRequestParameters<FormData> = {
        url: '/stripe/createStripeSession',
        payload: formData
    }

    return httpClient.post<FormData, StripeSessionResponse>(postParameters);
}