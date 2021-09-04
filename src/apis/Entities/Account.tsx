import { Course } from './Course';
import { EnrolledCourse } from './EnrolledCourse';
import { Tag } from './Tag'
export interface Account {
    accountId: number
    username: string
    name: string
    bio: string
    email: string
    displayPictureUrl: string
    isAdmin: boolean
    isActive: boolean
    interests: Tag[]
    enrolledCourses: EnrolledCourse[]
    courses: Course[]
    stripeAccountId: string
}

export interface CreateNewAccountReq {
    username: string
    password: string
    name: string
    bio: string
    email: string
    isAdmin: boolean
    tagTitles: string[]
}