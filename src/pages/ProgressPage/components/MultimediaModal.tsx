import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import React, { useState, useEffect } from 'react'
import {
    MultiMediaText,
    CourseDetails,
    CourseElement,
    TutorName,
    Button,
    Subject
} from "../ProgressElements";
import { makeStyles } from '@material-ui/core/styles';
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Account } from "../../../apis/Entities/Account";
import { Lesson } from "../../../apis/Entities/Lesson";
import { Content } from "../../../apis/Entities/Content";
import Link from '@material-ui/core/Link';


function MultimediaModal(props: any) {

    const [myAccount, setMyAccount] = useState<Account>()
    const [selectedLesson, setSelectedLesson] = useState<any>()

    useEffect(() => {
        setMyAccount(props.account)
        setSelectedLesson(props.lesson)
    }, [props.account])

    const getLessonMultimedia = (parentLesson: Lesson) => {
        var contents: Content[] = parentLesson.contents;
        return (
            <div style={{ display: "flex" }}>
                {contents.map(function (content, contentId) {
                    return (
                        <Link><MultiMediaText key={contentId}>{content.name},</MultiMediaText></Link>
                    );
                })}
            </div>
        )
    }

    return (
        <>
        </>
    )
}

export default MultimediaModal
