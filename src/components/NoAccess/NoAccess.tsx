import React from 'react'
import { MessageContainer, Message } from './NoAccessElements'

function NoAccess() {
    return (
        <MessageContainer>
            <Message>
                You do not have access to this page.
            </Message>
        </MessageContainer>
    )
}

export default NoAccess
