import { Course } from "./Course";
import {Lesson} from "./Lesson";
import {EnrolledLesson} from "./EnrolledLesson";


export interface EnrolledCourse {
    enrolledCourseId: number,
    dateTimeOfCompletion: Date,
    courseRating: number,
    parentCourse: Course
    enrolledLessons: EnrolledLesson[] // Todo
}

export interface EnrolledCourseWithStudentResp {
    studentId: number,
    enrolledCourseId: number,
    studentName: string,
    completionPercentage: number
}