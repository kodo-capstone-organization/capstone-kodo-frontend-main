import { Course } from "./Course";
import {Lesson} from "./Lesson";
import {EnrolledLesson} from "./EnrolledLesson";


export interface EnrolledCourse {
    enrolledCourseId: number
    courseRating: number,
    parentCourse: Course
    enrolledLessons: EnrolledLesson[] // Todo
}