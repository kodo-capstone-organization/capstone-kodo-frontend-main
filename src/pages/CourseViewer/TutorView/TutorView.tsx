import { useState, useEffect } from "react";

import { Course } from "../../../apis/Entities/Course";
import { EnrolledCourseWithStudentResp } from "../../../apis/Entities/EnrolledCourse";

import { getEnrolledCoursesWithStudentCompletion } from "../../../apis/EnrolledCourse/EnrolledCourseApis";

import {
  CourseTitle,
  PageHeading,
  PageHeadingAndButton,
  TutorContainer,
  TutorTitle,
} from "./TutorViewElements";

import TutorViewHeader from "./components/TutorViewHeader";
import TutorViewStudentsProgress from "./components/TutorViewStudentsProgress";

import { Button } from "../../../values/ButtonElements";


function TutorView(props: any) {
  
  const course: Course = props.course;

  const [enrolledStudentsAndCompletion, setEnrolledStudentsAndCompletion] = useState<EnrolledCourseWithStudentResp[]>();
  const [loading, setLoading] = useState<Boolean>(true);
  
  useEffect(() => {
    setLoading(true)
    getEnrolledCoursesWithStudentCompletion(course.courseId).then(receivedList => {
      setEnrolledStudentsAndCompletion(receivedList);
      setLoading(false)
    });
  }, [course]);

  return (
    !loading &&
      <TutorContainer>
        <TutorViewHeader course={course} />
        <TutorViewStudentsProgress course={course} />

        { (!enrolledStudentsAndCompletion || enrolledStudentsAndCompletion?.length === 0) &&
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2em", color: "#767C83" }}>
              There are no students who are enrolled in this course!
            </div>
        }
      </TutorContainer>
  );
}

export default TutorView;
