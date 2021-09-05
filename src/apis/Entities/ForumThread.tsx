import { Account } from "./Account";
import { ForumPost } from "./ForumPost";

export interface ForumThread {
    forumThreadId: number,
    name: string,
    description: string,
    timeStamp: Date,
    account: Account,
    forumPosts: ForumPost[]
}