import { httpClient } from "./HttpClientApis/HttpClient";
import { IHttpClientRequestParameters } from "./HttpClientApis/IHttpClientRequestParameters";
import { StripePaymentReq } from "../Entities/Stripe";
import { transformToBlob } from "../utils/BlobCreator";

const FormData = require("form-data");

export async function createStripeAccount(accountId: number): Promise<string> {
  const formData = new FormData();
  formData.append("accountId", accountId);

  const postParameters: IHttpClientRequestParameters<FormData> = {
    url: "/stripe/createStripeAccount",
    payload: formData
  };

  return httpClient.post<FormData, string>(postParameters);
}

export async function createStripeSession(
  stripePaymentReq: StripePaymentReq
): Promise<string> {
  const formData = new FormData();
  formData.append("stripePaymentReq", transformToBlob(stripePaymentReq));

  const postParameters: IHttpClientRequestParameters<FormData> = {
    url: "/stripe/createStripeSession",
    payload: formData
  };

  return httpClient.post<FormData, string>(postParameters);
}
