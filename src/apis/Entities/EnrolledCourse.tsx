import { Course } from "./Course";
import {Lesson} from "./Lesson";
import {CompletedLesson} from "./CompletedLesson";


export interface EnrolledCourse {
    enrolledCourseId: number
    courseRating: number,
    parentCourse: Course
    completedLessons: CompletedLesson[] // Todo
}