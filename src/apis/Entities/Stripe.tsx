export interface StripeAccountResponse {
    stripeAccountCreationUrl: string
}

export interface StripeSessionResponse {
    paymentUrl: string
}

export interface StripePaymentReq {
    studentId: number
    tutorId: number
    courseId: number
    tutorName: string
    amount: number
    tutorStripeAccountId: string
}