import { Course } from "./Course";
import { Content } from "./Content";

export interface Lesson {
    lessonId: number
    name: number,
    description: string,
    sequence: number,
    contents: Content[]
}