import { Account } from "./Account";
import { EnrolledCourse } from "./EnrolledCourse";
import { Tag } from "./Tag";

export interface Course {
    courseId: number
    name: string
    description: string
    price: number
    bannerUrl: string
    tutor: Account
    enrollment: EnrolledCourse[]
    // lessons: Lesson[] // TODO
    courseTags: Tag[]
    // forumCategories: ForumCategory[] // TODO
}

// When Frontend is creating a new course
export interface CreateNewCourseReq {
    name: string;
    description: string;
    price: string;
    tutorId: number;
    tagTitles: string[];
}