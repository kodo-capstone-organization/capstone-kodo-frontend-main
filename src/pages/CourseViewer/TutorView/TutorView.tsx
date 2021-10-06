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
import TutorViewStudentsProgress from "./components/TutorViewStudentsProgress/TutorViewStudentsProgress";

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
      </TutorContainer>
  );
}

export default TutorView;
