import { Course } from "./Course";
import { RawAccount } from "./Account";
import { EnrolledLesson } from "./EnrolledLesson";


export interface EnrolledCourse {
    enrolledCourseId: number,
    dateTimeOfCompletion: Date,
    courseRating: number,
    parentCourse: Course
    enrolledLessons: EnrolledLesson[] // Todo
}

export interface EnrolledCourseWithStudentResp {
    accountId: number;
    username: string;
    name: string;
    bio: string;
    email: string;
    displayPictureUrl: string;
    isAdmin: boolean;
    isActive: boolean;
    stripeAccountId: string;
    enrolledCourseId: number,
    completionPercentage: number
}