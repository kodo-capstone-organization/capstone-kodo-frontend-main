import {Lesson} from "./Lesson";

export interface CompletedLesson {
    completedLessonId: number,
    dateTimeOfCompletion: Date,
    parentLesson: Lesson,
}