import React, { useState, useEffect } from "react";
import {
  getEnrolledCourseByStudentIdAndCourseId,
  setCourseRatingByEnrolledCourseId,
  getEnrolledCoursesWithStudentCompletion
} from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { getAccountByEnrolledCourseId } from "../../../apis/Account/AccountApis";
import { EnrolledCourseWithStudentResp } from "../../../apis/Entities/EnrolledCourse";
import { Course } from "../../../apis/Entities/Course";
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

function TutorView(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });
  const [enrolledStudentsAndCompletion, setEnrolledStudentsAndCompletion] = useState<EnrolledCourseWithStudentResp[]>();
  
  useEffect(() => {
    setCourse(props.course);
  }, []);

  useEffect(() => {
    getEnrolledCoursesWithStudentCompletion(currentCourse.courseId).then(receivedList => {
      setEnrolledStudentsAndCompletion(receivedList);
    });
  }, []);

  let courseEnrollment = currentCourse.enrollment;

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

  return (
    <TutorContainer>
      <PageHeadingAndButton>
        <PageHeading>
          <CourseTitle>{currentCourse?.name}</CourseTitle>
          <TutorTitle>by {currentCourse?.tutor.name}</TutorTitle>
        </PageHeading>
        <Button primary to={`/builder/${currentCourse?.courseId}`}>
          Edit Course
        </Button>
      </PageHeadingAndButton>

      { enrolledStudentsAndCompletion && enrolledStudentsAndCompletion?.length > 0 &&
        <StudentProgressCard>        
          <CardTitle>Students</CardTitle>
          <StudentProgressWrapper>
            {enrolledStudentsAndCompletion?.map(enrolledCourse => {
              return (
                <>
                  <p>{enrolledCourse.studentName}</p>
                  <LinearProgressWithLabel
                    value={enrolledCourse.completionPercentage * 100}
                  />
                </>
              );
            })}
          </StudentProgressWrapper>
        </StudentProgressCard>
      }

      { !enrolledStudentsAndCompletion || enrolledStudentsAndCompletion?.length == 0 &&
          <div style={{ textAlign: "center", fontSize: "2em" }}>
            There are no students who are enrolled in this course!
          </div>
      }

    </TutorContainer>
  );
}

export default TutorView;
