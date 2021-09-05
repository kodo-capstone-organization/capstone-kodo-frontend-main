import { Account } from "./Account";

export interface ForumPost {
    forumPostId: number,
    message: string,
    timeStamp: Date,
    reply: ForumPost
    account: Account
}