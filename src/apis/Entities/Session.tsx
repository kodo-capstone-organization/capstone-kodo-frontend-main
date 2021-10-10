
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

export interface KodoDataChannelMessage {
    peerId: number,
    eventType: KodoSessionEventType,
    event: KodoSessionEvent
}

export interface KodoSessionEvent {
    eventType: KodoSessionEventType
}

export enum KodoSessionEventType {
    CALL = "CALL",
    WHITEBOARD = "WHITEBOARD",
    EDITOR = "EDITOR"
}

export interface CallEvent extends KodoSessionEvent {
    message?: string,
    isMuted?: boolean
}

export interface WhiteboardEvent extends KodoSessionEvent {
    eventType: KodoSessionEventType.WHITEBOARD
    // TODO
}

export interface EditorEvent extends KodoSessionEvent {
    eventType: KodoSessionEventType.EDITOR,
    // TODO
}