import { EnrolledContent } from "./EnrolledContent";
import { Lesson } from "./Lesson";

export interface EnrolledLesson {
  enrolledLessonId: number;
  dateTimeOfCompletion: Date;
  enrolledContents: EnrolledContent[];
  parentLesson: Lesson;
}

export interface EnrolledLessonWithStudentName {
  enrolledLesson: EnrolledLesson;
  studentName: string;
}
