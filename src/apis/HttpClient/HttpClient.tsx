import axios, { AxiosRequestConfig } from 'axios';
import { IHttpClient } from './IHttpClient';
import { IHttpClientRequestParameters } from './IHttpClientRequestParameters';
import { formatUrl } from './UrlFormatter';

export class HttpClient implements IHttpClient {

    get<T>(parameters: IHttpClientRequestParameters<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const { url } = parameters

            const options: AxiosRequestConfig = {
                headers: {},
            }

            axios
                .get(formatUrl(url), options)
                .then((response: any) => {
                    resolve(response.data as T)
                })
                .catch((response: any) => {
                    reject(response)
                })
        })
    } 

    post<T>(parameters: IHttpClientRequestParameters<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const { url, payload } = parameters
             
            const options: AxiosRequestConfig = {
                headers: {}
            }

            axios
                .post(formatUrl(url), payload, options)
                .then((response: any) => {
                    resolve(response.data as T)
                })
                .catch((response: any) => {
                    reject(response)
                })
        })
    } 
}

export const httpClient = new HttpClient();