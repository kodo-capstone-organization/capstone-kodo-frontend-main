import React, { useState, useEffect } from "react";
import { getEnrolledCourseByStudentIdAndCourseId, setCourseRatingByEnrolledCourseId } from "../../../apis/EnrolledCourse/EnrolledCourse";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Course } from "../../../apis/Entities/Course";


import {
  TutorContainer,
  PageHeading,
  CourseTitle,
  TutorTitle,
  StudentProgressCard,
  CardTitle,
  StudentProgressWrapper,
} from "./TutorViewElements";


import { makeStyles } from '@material-ui/core/styles';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

function TutorView(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });

  useEffect(() => {
    setCourse(props.course);
  }, []);

  console.log(currentCourse)



  return (
    <TutorContainer>
        <PageHeading>
            <CourseTitle>{currentCourse?.name}</CourseTitle>
            <TutorTitle>by {currentCourse?.tutor.name}</TutorTitle>
        </PageHeading>
        <StudentProgressCard>
            <CardTitle>Students</CardTitle>
            <StudentProgressWrapper>
              <p>Jason</p>
              <LinearProgressWithLabel value={60} />
              <p>Jason</p>
              <LinearProgressWithLabel value={60} />
              <p>Jason</p>
              <LinearProgressWithLabel value={60} />
              <p>Jason</p>
              <LinearProgressWithLabel value={60} />
              <p>Jason</p>
              <LinearProgressWithLabel value={60} />
              <p>Jason</p>
              <LinearProgressWithLabel value={60} />
              <p>Jason</p>
              <LinearProgressWithLabel value={60} />

            </StudentProgressWrapper>
        </StudentProgressCard>
    </TutorContainer>
  );
}

export default TutorView;
