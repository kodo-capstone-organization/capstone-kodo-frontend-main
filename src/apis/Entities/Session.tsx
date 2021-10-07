
export interface CreateSessionReq {
    sessionName: string,
    isPublic: boolean,
    creatorId: number,
    inviteeIds: number[]
}

export interface InvitedSessionResp {
    sessionName: string,
    sessionId: string,
    hostId: number
}