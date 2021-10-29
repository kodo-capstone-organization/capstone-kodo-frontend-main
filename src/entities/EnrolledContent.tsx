import { Content } from "./Content";
import { StudentAttempt } from "./StudentAttempt";

export interface EnrolledContent {
  enrolledContentId: number;
  dateTimeOfCompletion: Date;
  parentContent: Content;
  studentAttempts: StudentAttempt[];
}