import { Course } from "./Course";

export interface EnrolledCourse {
    enrolledCourseId: number
    courseRating: number,
    parentCourse: Course
    // completedLessons: Lesson[] // Todo
}