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
    totalEnrollmentCount: number,
    totalPublishedCourseCount: number,
    totalCourseCount: number,
    lifetimeTotalEarnings: number,
    lifetimeEarningsByCourse: any[],
    currentMonthTotalEarnings: number,
    currentMonthEarningsByCourse: any[],
    courseStatsByMonthForLastYear: NestedCourseStats[]
}

export interface NestedCourseStats {
    courseId: string,
    courseName: string,
    lifetimeEarnings: string,
    currentMonthEarnings: string,
    monthlyAverageEarnings: string,
    highestEarningMonthWithValue: string,
    data: any // stringified
}