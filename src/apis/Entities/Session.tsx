
export interface CreateSessionReq {
    sessionName: string,
    isPublic: boolean,
    creatorId: number,
    inviteeIds: number[]
}