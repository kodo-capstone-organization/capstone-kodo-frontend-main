import React, { useEffect, useState } from 'react'
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { Course } from "../../../apis/Entities/Course";
import { PreviewContainer, EnrollCard, EnrollImage, EnrollBtn, CourseTags, TagChip, CourseHeader, CourseProviderName, CourseDescription } from "./CoursePreviewElements"
import { Button } from "../../../values/ButtonElements";

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';


function CoursePreviewPage(props: any) {
    const courseId = props.match.params.courseId;

    const [currentCourse, setCourse] = useState<Course>();

    useEffect(() => {
        getCourseByCourseId(courseId).then(receivedCourse => {
            setCourse(receivedCourse);
            console.log(receivedCourse.name);
        })
    }, [])

    return (
        <PreviewContainer>
            <EnrollCard>
                <EnrollImage src="/chessplaceholder.png" />
                <EnrollBtn><Button primary={true} big={false} fontBig={false}>Enroll</Button></EnrollBtn>
            </EnrollCard>
            <CourseTags>
                {currentCourse?.courseTags.map(tag => (
                    <TagChip label={tag.title} />
                ))}

            </CourseTags>
            <CourseHeader>{currentCourse?.name}</CourseHeader>
            <CourseProviderName>{currentCourse?.tutor.name}</CourseProviderName>  
            <CourseHeader>Description</CourseHeader>  
            <CourseDescription>{currentCourse?.description}</CourseDescription>
            <CourseHeader>Syllabus and Schedule</CourseHeader>
        </PreviewContainer>   
    )
}

const CoursePreviewPageWithRouter = withRouter(CoursePreviewPage);
export default CoursePreviewPageWithRouter
