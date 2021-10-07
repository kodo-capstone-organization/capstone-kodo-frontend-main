import axios, { AxiosRequestConfig } from 'axios';
import { IHttpClient } from './IHttpClient';
import { IHttpClientRequestParameters } from './IHttpClientRequestParameters';
import { formatUrl } from './UrlFormatter';

export class HttpClient implements IHttpClient {

    get<T, R>(parameters: IHttpClientRequestParameters<T>, isWebRTC?: boolean): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            const { url } = parameters

            const options: AxiosRequestConfig = {
                headers: {},
            }

            axios
                .get(formatUrl(url, isWebRTC || false), options)
                .then((response: any) => {
                    resolve(response.data as R)
                })
                .catch((response: any) => {
                    reject(response)
                })
        })
    }

    post<T, R>(parameters: IHttpClientRequestParameters<T>, isWebRTC?: boolean): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            const { url, payload } = parameters

            const options: AxiosRequestConfig = {
                headers: {}
            }

            axios
                .post(formatUrl(url, isWebRTC || false), payload, options)
                .then((response: any) => {
                    resolve(response.data as R)
                })
                .catch((response: any) => {
                    reject(response)
                })
        })
    }

    put<T, R>(parameters: IHttpClientRequestParameters<T>,  isWebRTC?: boolean): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            const { url, payload } = parameters

            const options: AxiosRequestConfig = {
                headers: {}
            }

            axios
                .put(formatUrl(url,  isWebRTC || false), payload, options)
                .then((response: any) => {
                    resolve(response.data as R)
                })
                .catch((response: any) => {
                    reject(response)
                })
        })
    }

    delete<T, R>(parameters: IHttpClientRequestParameters<T>, isWebRTC?: boolean): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            const { url, payload } = parameters

            axios
                .delete(formatUrl(url, isWebRTC || false), { headers: {}, data: payload })
                .then((response: any) => {
                    resolve(response.data as R)
                })
                .catch((response: any) => {
                    reject(response)
                })
        })
    }
}

export const httpClient = new HttpClient();