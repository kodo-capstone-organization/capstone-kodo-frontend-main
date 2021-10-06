import { useState, useEffect } from "react";

import { Course } from "../../../../apis/Entities/Course";

import Rating from '@material-ui/lab/Rating';

import { getCourseRatingByCourseId } from "../../../../apis/Course/CourseApis";

import {
    CourseTitle,
    TutorCourseRatingBox,
    TutorTitle,
    TutorViewCard,
    TutorViewCardContent,
    TutorViewColumn,
    TutorViewRow,
} from "../TutorViewElements";

import { Button } from "../../../../values/ButtonElements";


function TutorViewHeader(props: any) {

    const course: Course = props.course;

    const [courseRating, setCourseRating] = useState<number>(0);

    useEffect(() => {
        getCourseRatingByCourseId(course.courseId).then((res) => {
            setCourseRating(res);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [course]);

    return (
        <>             
            <TutorViewCard>
                <TutorViewCardContent style={{justifyContent: "space-between"}}>
                    <TutorViewColumn>
                        <CourseTitle>{course?.name}</CourseTitle>
                        <TutorTitle>by {course?.tutor.name}</TutorTitle>
                        <TutorViewRow>
                            <Rating value={courseRating} precision={0.1} readOnly /> 
                            <TutorCourseRatingBox>
                                {courseRating}
                            </TutorCourseRatingBox>
                        </TutorViewRow>
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