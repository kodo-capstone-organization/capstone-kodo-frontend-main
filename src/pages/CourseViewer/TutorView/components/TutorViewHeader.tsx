import { useState } from "react";
import { Course } from "../../../../apis/Entities/Course";

import {
    TutorViewCard,
    TutorViewCardContent,
    CourseTitle,
    TutorTitle,
    TutorViewRow,
    TutorViewColumn
  } from "../TutorViewElements";

import { Button } from "../../../../values/ButtonElements";


function TutorViewHeader(props: any) {

    const course: Course = props.course;

    return (
        <>             
            <TutorViewCard>
                <TutorViewCardContent style={{justifyContent: "space-between"}}>
                    <TutorViewColumn>
                        <CourseTitle>{course?.name}</CourseTitle>
                        <TutorTitle>by {course?.tutor.name}</TutorTitle>
                    </TutorViewColumn>
                    <TutorViewColumn>
                        <Button primary to={`/builder/${course?.courseId}`}>
                            Edit Course
                        </Button>
                    </TutorViewColumn>
                </TutorViewCardContent>
            </TutorViewCard>            
        </>
    );
}

export default TutorViewHeader;