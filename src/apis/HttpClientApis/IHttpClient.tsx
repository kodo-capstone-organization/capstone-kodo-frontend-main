import { IHttpClientRequestParameters } from "./IHttpClientRequestParameters";
export interface IHttpClient {
    get<T,R>(parameters: IHttpClientRequestParameters<T>): Promise<R>
    post<T,R>(parameters: IHttpClientRequestParameters<T>): Promise<R>
    put<T,R>(parameters: IHttpClientRequestParameters<T>): Promise<R>
    delete<T,R>(parameters: IHttpClientRequestParameters<T>): Promise<R>
    getExternalUrl<T,R>(parameters: IHttpClientRequestParameters<T>): Promise<R>
}