import { Course } from "./Course";
import {Lesson} from "./Lesson";

export interface EnrolledCourse {
    enrolledCourseId: number
    courseRating: number,
    parentCourse: Course
    completedLessons: Lesson[] // Todo
}