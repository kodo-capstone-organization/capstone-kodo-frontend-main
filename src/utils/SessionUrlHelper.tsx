export const appendSpacingToSessionId = (sessionId: string) => {
    return sessionId.substring(0, 3) + " " + sessionId.substring(3, 6) + " " + sessionId.substring(6);
}

export const removeSpacingFromSessionId = (sessionId: string) => {
    return sessionId.replace(/\s+/g, '');
}