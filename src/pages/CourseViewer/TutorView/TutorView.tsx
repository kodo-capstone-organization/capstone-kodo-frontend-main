import React, { useState, useEffect } from "react";
import {
  getEnrolledCourseByStudentIdAndCourseId,
  setCourseRatingByEnrolledCourseId
} from "../../../apis/EnrolledCourse/EnrolledCourse";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Course } from "../../../apis/Entities/Course";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";


import {
  TutorContainer,
  PageHeading,
  CourseTitle,
  TutorTitle,
  StudentProgressCard,
  CardTitle,
  StudentProgressWrapper
} from "./TutorViewElements";

import { makeStyles } from "@material-ui/core/styles";
import LinearProgress, {
  LinearProgressProps
} from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles({
  root: {
    width: "100%"
  }
});

function TutorView(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });
  var studentProgress = {}

  useEffect(() => {
    setCourse(props.course);
  }, []);

  let courseEnrollment = currentCourse.enrollment;
  console.log(courseEnrollment)

  function getPercentage(enrolledLessons: EnrolledLesson[]) {
    var total = enrolledLessons.length;
    var completed = 0;
    for(var ec of enrolledLessons) {
      if (ec.dateTimeOfCompletion != null) {
        completed = completed + 1;
      }
    }
    return (completed/total)*100
  }

  function getName(enrolledCourse: EnrolledCourse) {
    //var student = getStudentWithEnrolledCourseId(enrolledCourse.enrolledCourseId)
    //return student.name    
  }



  return (
    <TutorContainer>
      <PageHeading>
        <CourseTitle>{currentCourse?.name}</CourseTitle>
        <TutorTitle>by {currentCourse?.tutor.name}</TutorTitle>
      </PageHeading>
      <StudentProgressCard>
        <CardTitle>Students</CardTitle>
        <StudentProgressWrapper>
          {courseEnrollment.map((enrolledCourse) => { 
            return (
              <>
              {/*
              <p>{getName(enrolledCourse)}</p>
              */}
              <p>Student Name:</p>
              <LinearProgressWithLabel value={getPercentage(enrolledCourse.enrolledLessons)} />
              </>
            );
          })}
        </StudentProgressWrapper>
      </StudentProgressCard>
    </TutorContainer>
  );
}

export default TutorView;
