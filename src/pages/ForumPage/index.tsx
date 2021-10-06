import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import {
    ForumContainer, ForumCardHeader, ForumCardContent, ForumCard
} from "./ForumElements";

function ForumPage(props: any) {

    useEffect(() => {
    }, [])

    return (
        <ForumContainer>
            <ForumCard>
                <ForumCardHeader
                    title="Forum Details"
                />
                <ForumCardContent>
                </ForumCardContent>
            </ForumCard>
        </ForumContainer>
    );
}

export default ForumPage
