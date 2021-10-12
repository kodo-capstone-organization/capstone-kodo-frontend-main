import {useEffect, useState } from "react";
import {KodoAvatarInitials, KodoAvatarWrapper } from "./KodoAvatarElements";


function KodoAvatar(props: any) {
    
    const [name, setName] = useState("")
    const [displayPictureURL, setDisplayPictureURL] = useState("")
    
    useEffect(() => {
        setName(props.name)
        setDisplayPictureURL(props.displayPictureURL || "")
    }, [props.name, props.displayPictureURL])
    
    const avatarInitials = () => {
        if (name) {
            return name.split(" ").map(x => x[0].toUpperCase()).join("")
        } else {
            return "";
        }
    }
    
    return (
        <KodoAvatarWrapper
            alt={name}
            src={displayPictureURL}
            style={{
                height: props.small ?  "5rem" : "8rem",
                width: props.small ?  "5rem" : "8rem",
                border: props.showRing ? "solid lightblue" : ""
            }}
        >
            <KodoAvatarInitials>
                {avatarInitials()}
            </KodoAvatarInitials>
        </KodoAvatarWrapper>
    )
}

export default  KodoAvatar;