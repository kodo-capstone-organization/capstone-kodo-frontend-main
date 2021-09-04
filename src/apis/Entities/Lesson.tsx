import { Course } from "./Course";
import { Content } from "./Content";
import { Quiz } from "./Quiz";
import { Multimedia } from "./Multimedia";

export interface Lesson {
    lessonId: number
    name: number,
    description: string,
    sequence: number,
    contents: Content[],
    // Note: We further decompose Content[] into children Quizzes[] and Multimedia[] on the frontend
    quizzes: Quiz[]
    multimedias: Multimedia[]
}