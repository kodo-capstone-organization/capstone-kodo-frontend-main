import { Account } from "./Account";

export interface ForumPost {
    forumPostId : (number | null),
    message : string,
    timeStamp : Date,
    isReported : boolean,
    reasonForReport: string,
    replies : ForumPost[],
    parentForumPost : ForumPost,
    account : Account
}

export interface CreateNewForumPostReq {
    message: string,
    timeStamp: Date,
    accountId: number,
    forumThreadId: (number | null)
}

export interface CreateNewForumPostReplyReq {
    newForumPostReply: ForumPost,
    accountId: number
}

export interface ForumPostWithRepliesResp {
    forumPostId: (number | null),
    message: string,
    timeStamp: Date,
    replies: ForumPostWithRepliesResp
}