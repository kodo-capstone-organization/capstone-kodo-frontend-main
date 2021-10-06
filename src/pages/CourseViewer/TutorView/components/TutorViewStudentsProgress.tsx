import { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import LinearProgress, {
  LinearProgressProps
} from "@material-ui/core/LinearProgress";

import { Course } from "../../../../apis/Entities/Course";
import { EnrolledCourseWithStudentResp } from "../../../../apis/Entities/EnrolledCourse";

import { getEnrolledCoursesWithStudentCompletion } from "../../../../apis/EnrolledCourse/EnrolledCourseApis";

import {
  StudentProgressWrapper,
  TutorViewCard,
  TutorViewCardHeader,
  TutorViewCardContent,
  StudentProgressScroll,
} from "../TutorViewElements";


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
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

function TutorViewStudentsProgress(props: any) {

    const course: Course = props.course;

    const [enrolledStudentsAndCompletion, setEnrolledStudentsAndCompletion] = useState<EnrolledCourseWithStudentResp[]>();
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        setLoading(true)
        getEnrolledCoursesWithStudentCompletion(course.courseId).then((receivedList: EnrolledCourseWithStudentResp[]) => {
          setEnrolledStudentsAndCompletion(receivedList);
          setLoading(false)
        });
      }, [course]);

    return (
        <>
          { (!loading && enrolledStudentsAndCompletion && enrolledStudentsAndCompletion?.length > 0) &&
              <TutorViewCard>
                  <TutorViewCardHeader title="Students Progress"/>
                  <TutorViewCardContent>
                      <StudentProgressScroll>
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
                      </StudentProgressScroll>
                  </TutorViewCardContent>
              </TutorViewCard>
          }
        </>
    );
}

export default TutorViewStudentsProgress;