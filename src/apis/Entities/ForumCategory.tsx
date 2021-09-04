import { Course } from "./Course";
import { ForumThread } from "./ForumThread";

export interface ForumCategory {
    forumCategoryId: number,
    name: string,
    description: string,
    forumThreads: ForumThread[],
    course: Course
}