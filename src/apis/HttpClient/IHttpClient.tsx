import { IHttpClientRequestParameters } from "./IHttpClientRequestParameters";
export interface IHttpClient {
    get<T,R>(parameters: IHttpClientRequestParameters<T>): Promise<R>
    post<T,R>(parameters: IHttpClientRequestParameters<T>): Promise<R>
}