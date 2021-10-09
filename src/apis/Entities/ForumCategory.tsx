import { Course } from "./Course";
import { ForumThread } from "./ForumThread";

export interface ForumCategory {
    forumCategoryId: number,
    name: string,
    description: string,
    forumThreads: ForumThread[],
    course: Course
}

export interface ForumCategoriesWithoutForumThreadsAndCourses {
    forumCategoryId: number,
    name: string,
    description: string,
    forumThreads: ForumThread[]
}

export interface UpdateForumCategoryReq {
    forumCategory: ForumCategory
}

export interface CreateNewForumCategoryReq {
    name: string,
    description: string,
    courseId: number
}