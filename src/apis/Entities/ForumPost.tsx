import { Account } from "./Account";

export interface ForumPost {
    forumPostId: number,
    message: string,
    timeStamp: Date,
    parentForumPost: (ForumPost | null)
    account: Account
}

export interface CreateNewForumPostReq {
    message : string,
    timeStamp : Date,
    accountId : number,
    forumThreadId : number
}

export interface CreateNewForumPostReplyReq {
    newForumPostReply : ForumPost,
    accountId : number
}