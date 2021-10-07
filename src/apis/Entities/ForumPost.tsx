import { Account } from "./Account";

export interface ForumPost {
    forumPostId: number,
    message: string,
    timeStamp: Date,
    reply: ForumPost
    account: Account
}

export interface CreateNewForumPostReq {
    message : string,
    timeStamp : Date,
    accountId : number,
    forumThreadId : number
}