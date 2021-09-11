import { Course } from "./Course";
import { EnrolledCourse } from "./EnrolledCourse";
import { StudentAttempt } from "./StudentAttempt";
import { Tag } from "./Tag";

export interface Account {
  accountId: number;
  username: string;
  name: string;
  bio: string;
  email: string;
  displayPictureUrl: string;
  isAdmin: boolean;
  isActive: boolean;
  interests: Tag[];
  enrolledCourses: EnrolledCourse[];
  courses: Course[];
  studentAttempts: StudentAttempt[];
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
  studentAttemptIds: number[];
<<<<<<< HEAD
}
=======
}
>>>>>>> initialise updateAccount api method
