import { Account } from "./Account";
import { EnrolledCourse } from "./EnrolledCourse";
import { Tag } from "./Tag";
import { Lesson } from "./Lesson";

export interface Course {
  courseId: number;
  name: string;
  description: string;
  price: number;
  bannerUrl: string;
  tutor: Account;
  enrollment: EnrolledCourse[];
  dateTimeOfCreation: Date;
  lessons: Lesson[];
  courseTags: Tag[];
  bannerPictureFileName: string;
  isEnrollmentActive: boolean;
  isReviewRequested: boolean;
  courseRating: number;
}

// When Frontend is creating a new course
export interface CreateNewCourseReq {
  name: string;
  description: string;
  price: string;
  tutorId: number;
  tagTitles: string[];
}

export interface UpdateCourseReq {
  course: Course;
  courseTagTitles: string[];
}

export interface ToggleCourseResp {
  responseBody: string
}

export interface RecommendedCoursesWithTags {
  courses: Course[];
  tags: Tag[];
}