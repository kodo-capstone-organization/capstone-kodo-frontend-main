import { Account } from "./Account";
import { Course } from "./Course";

export interface Transaction {
    transactionId: number
    dateTimeOfTransaction: Date,
    stripeTransactionId: string,
    stripeFee: number,
    platformFee: number,
    coursePrice: number,
    tutorPayout: number,
    payer: Account,
    payee: Account,
    course: Course
}

export interface GroupedByMonthsTransaction {
    [key: string]: any
}

export interface TutorCourseEarningsResp {
    lifetimeTotalEarnings: number,
    lifetimeEarningsByCourse: any[],
    currentMonthTotalEarnings: number,
    currentMonthEarningsByCourse: any[]
}