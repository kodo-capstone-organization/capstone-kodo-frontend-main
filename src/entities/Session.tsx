import { monaco } from 'react-monaco-editor';

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
    encodedCanvasData?: string
    cursorLocation?: WhiteboardCursorLocation 
}

export interface EditorEvent extends KodoSessionEvent {
    editorData?: string
    selectedLanguage?: string
    cursorLocation?: EditorCursorLocation
    cursorSelection?: monaco.Selection
}

export interface EditorCursorLocation {
    lineNumber: number
    column: number
}

export interface WhiteboardCursorLocation {
    cursorX: number
    cursorY: number
}