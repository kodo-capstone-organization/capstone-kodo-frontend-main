import React, { useState, useEffect } from "react";
import {
  getEnrolledCourseByStudentIdAndCourseId,
  setCourseRatingByEnrolledCourseId
} from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { getAccountByEnrolledCourseId } from "../../../apis/Account/AccountApis";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Course } from "../../../apis/Entities/Course";
import { Account } from "../../../apis/Entities/Account";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";
import { Button } from "../../../values/ButtonElements";

import {
  TutorContainer,
  PageHeadingAndButton,
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
  const [student, setStudent] = useState<Account>();
  useEffect(() => {
    setCourse(props.course);
  }, []);

  let courseEnrollment = currentCourse.enrollment;
  console.log(courseEnrollment);

  function getPercentage(enrolledLessons: EnrolledLesson[]) {
    var total = enrolledLessons.length;
    var completed = 0;
    for (var ec of enrolledLessons) {
      if (ec.dateTimeOfCompletion != null) {
        completed = completed + 1;
      }
    }
    return (completed / total) * 100;
  }

  async function getName(enrolledCourse: EnrolledCourse) {
    //getAccountByEnrolledCourseId(enrolledCourse.enrolledCourseId)
  }

  return (
    <TutorContainer>
      <PageHeadingAndButton>
        <PageHeading>
          <CourseTitle>{currentCourse?.name}</CourseTitle>
          <TutorTitle>by {currentCourse?.tutor.name}</TutorTitle>
        </PageHeading>
        <Button primary to={`/builder/${currentCourse?.courseId}`}>
          Edit
        </Button>
      </PageHeadingAndButton>

      <StudentProgressCard>
        <CardTitle>Students</CardTitle>
        <StudentProgressWrapper>
          {courseEnrollment.map(enrolledCourse => {
            return (
              <>
                <p>Name</p>
                <LinearProgressWithLabel
                  value={getPercentage(enrolledCourse.enrolledLessons)}
                />
              </>
            );
          })}
        </StudentProgressWrapper>
      </StudentProgressCard>
    </TutorContainer>
  );
}

export default TutorView;
