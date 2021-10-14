import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  TutorContainer,
} from "./TutorViewElements";

import { Course } from "../../../apis/Entities/Course";

import { getCourseWithoutEnrollmentByCourseIdAndAccountId } from "../../../apis/Course/CourseApis";

import TutorViewHeader from "./components/TutorViewHeader";
import TutorViewStudentsProgress from "./components/TutorViewStudentsProgress/TutorViewStudentsProgress";


function TutorView(props: any) {

  const courseId = props.courseId;
  const accountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");
  
  const[course, setCourse] = useState<Course>();

  const history = useHistory();

  useEffect(() => {
    getCourseWithoutEnrollmentByCourseIdAndAccountId(courseId, accountId)
    .then((tmpCourse: Course) => {
      setCourse(tmpCourse);
      props.setCourse(tmpCourse);
    })
    .catch((err) => handleError(err));    
  }, [courseId, accountId])

  function handleError(err: any): void {
    const errorDataObj = createErrorDataObj(err);
    props.callOpenSnackBar("Error in retrieving course", "error");
    history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
  }

  function createErrorDataObj(err: any): any {
    const errorDataObj = { 
        message1: 'Unable to view course',
        message2: err.response.data.message,
        errorStatus: err.response.status,
        returnPath: '/browsecourse',
        returnText: 'Browse Course'
    }

    return errorDataObj;
  }

  return (
    <>
    { course &&
        <TutorContainer>
          <TutorViewHeader course={course} />
          <TutorViewStudentsProgress course={course} />        
        </TutorContainer>    
    }
    </>
  );
}

export default TutorView;
