import { Content } from "./Content";

export interface EnrolledContent {
  enrolledContentId: number;
  dateTimeOfCompletion: Date;
  content: Content;
}
