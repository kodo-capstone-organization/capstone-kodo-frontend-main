import { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import LinearProgress, {
  LinearProgressProps
} from "@material-ui/core/LinearProgress";

import { Course } from "../../../apis/Entities/Course";
import { EnrolledCourseWithStudentResp } from "../../../apis/Entities/EnrolledCourse";

import { getEnrolledCoursesWithStudentCompletion } from "../../../apis/EnrolledCourse/EnrolledCourseApis";

import {
  CardTitle,
  CourseTitle,
  PageHeading,
  PageHeadingAndButton,
  StudentProgressCard,
  StudentProgressWrapper,
  TutorContainer,
  TutorTitle,
} from "./TutorViewElements";

import { Button } from "../../../values/ButtonElements";


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
  const [loading, setLoading] = useState<Boolean>(true);
  
  useEffect(() => {
    setLoading(true)
    setCourse(props.course);
    getEnrolledCoursesWithStudentCompletion(currentCourse.courseId).then(receivedList => {
      setEnrolledStudentsAndCompletion(receivedList);
      setLoading(false)
    });
  }, []);

  return (
    !loading &&
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
                      key={enrolledCourse.enrolledCourseId}
                      value={enrolledCourse.completionPercentage * 100}
                  />
                </>
              );
            })}
          </StudentProgressWrapper>
        </StudentProgressCard>
      }

      { (!enrolledStudentsAndCompletion || enrolledStudentsAndCompletion?.length === 0) &&
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2em", color: "#767C83" }}>
            There are no students who are enrolled in this course!
          </div>
      }

    </TutorContainer>
  );
}

export default TutorView;
