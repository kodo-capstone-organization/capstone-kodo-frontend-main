export interface StripePaymentReq {
    studentId: number
    tutorId: number
    courseId: number
    tutorName: string
    amount: number
    tutorStripeAccountId: string
}