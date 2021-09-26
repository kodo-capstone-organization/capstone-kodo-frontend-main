import { Course } from "./Course";
import { Content } from "./Content";
import { Quiz } from "./Quiz";
import { Multimedia, MultimediaReq} from "./Multimedia";

export interface Lesson {
    lessonId: number
    name: string,
    description: string,
    sequence: number,
    contents: Content[],
    // Note: We further decompose Content[] into children Quizzes[] and Multimedia[] on the frontend
    quizzes: Quiz[]
    multimedias: Multimedia[]
}

export interface UpdateLessonReq {
    lesson: Lesson
    quizzes: Quiz[];
    multimediaReqs: MultimediaReq[];
  }