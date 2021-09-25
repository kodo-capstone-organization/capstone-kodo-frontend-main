import { Course } from "./Course";
import { EnrolledCourse } from "./EnrolledCourse";
import { Tag } from "./Tag";

export interface Account {
  accountId: number;
  username: string;
  password: string | null;
  name: string;
  bio: string;
  email: string;
  displayPictureUrl: string;
  displayPictureFilename: string;
  isAdmin: boolean;
  isActive: boolean;
  interests: Tag[];
  enrolledCourses: EnrolledCourse[];
  courses: Course[];
  stripeAccountId: string;
}

export interface CreateNewAccountReq {
  username: string;
  password: string;
  name: string;
  bio: string;
  email: string;
  isAdmin: boolean;
  tagTitles: string[];
}

export interface UpdateAccountReq {
  account: Account;
  tagTitles: string[];
  enrolledCourseIds: string[];
  courseIds: number[];
  forumThreadIds: number[];
  forumPostIds: number[];
}

export interface UpdateAccountPasswordReq {
  accountId: number;
  username: string;
  oldPassword: string;
  newPassword: string;
}
