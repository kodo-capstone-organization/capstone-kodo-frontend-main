import { Account } from "./Account";
import { EnrolledCourse } from "./EnrolledCourse";
import { Tag } from "./Tag";
import { Lesson } from "./Lesson";


export interface Course {
    courseId: number
    name: string
    description: string
    price: number
    bannerUrl: string
    tutor: Account
    enrollment: EnrolledCourse[]
    lessons: Lesson[]
    courseTags: Tag[]
}

// When Frontend is creating a new course
export interface CreateNewCourseReq {
    name: string;
    description: string;
    price: string;
    tutorId: number;
    tagTitles: string[];
}