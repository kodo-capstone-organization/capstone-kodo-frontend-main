import { useState, useEffect } from "react";

import { Course } from "../../../../entities/Course";

import Rating from '@material-ui/lab/Rating';
import Tooltip from '@material-ui/core/Tooltip';

import { Account } from "../../../../entities/Account";

import { getAccountByCourseId } from "../../../../apis/AccountApis";
import { getCourseRatingByCourseId } from "../../../../apis/CourseApis";

import {
    CourseTitle,
    TutorTitle,
    TutorViewCard,
    TutorViewCardContent,
    TutorViewColumn,
    TutorViewRow,
} from "../TutorViewElements";

import { Button } from "../../../../values/ButtonElements";


function TutorViewHeader(props: any) {

    const course: Course = props.course;

    const [tutor, setTutor] = useState<Account>();
    const [courseRating, setCourseRating] = useState<number>(0);

    useEffect(() => {
        getCourseRatingByCourseId(course.courseId)
        .then((tmpCourseRating: number) => setCourseRating(tmpCourseRating))
        .catch((err) => {
            console.log(err);
        });
        getAccountByCourseId(course.courseId)
        .then((account: Account) => setTutor(account))
        .catch((err) => {
            console.log(err);
        });
    }, [course]);

    return (
        <>          
            { (course && tutor) && 
                <TutorViewCard>
                    <TutorViewCardContent style={{justifyContent: "space-between"}}>
                        <TutorViewColumn>
                            <CourseTitle>{course.name}</CourseTitle>
                            <TutorTitle>by {tutor.name}</TutorTitle>
                            <TutorViewRow>
                                <Tooltip title={<div style={{ fontSize: "1.5em", padding: "2px" }}>{courseRating.toFixed(2)}</div>}>
                                    <div>
                                        <Rating value={courseRating} precision={0.1} readOnly /> 
                                    </div>
                                </Tooltip>
                            </TutorViewRow>
                        </TutorViewColumn>
                        <TutorViewColumn>
                            <Button primary to={`/builder/${course?.courseId}`}>
                                Edit Course
                            </Button>
                        </TutorViewColumn>
                    </TutorViewCardContent>
                </TutorViewCard> 
            }           
        </>
    );
}

export default TutorViewHeader;