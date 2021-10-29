import { Account } from "./Account";

export interface ForumPost {
    forumPostId : (number | null),
    message : string,
    timeStamp : Date,
    reported : boolean,
    reasonForReport: (string | null),
    replies : ForumPost[],
    parentForumPost : (ForumPost | null),
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
    accountId: number,
    parentForumPostId: number
}

export interface ForumPostWithRepliesResp {
    forumPostId: (number | null),
    message: string,
    timeStamp: Date,
    account : Account,
    replies: ForumPostWithRepliesResp[]
}

export interface UpdateForumPostReq {
    forumPost: ForumPost,
    reasonForReport : string
}