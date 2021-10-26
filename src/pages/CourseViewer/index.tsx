import { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";

import { Course } from "../../Entities/Course";

import { isStudentByCourseIdAndAccountId } from "../../apis/CourseApis";
import { isTutorByCourseIdAndAccountId } from "../../apis/CourseApis";

import Sidebar from "./Sidebar/Sidebar";
import TutorView from "./TutorView/TutorView";
import StudentView from "./StudentView/StudentView";
import CircularProgress from '@material-ui/core/CircularProgress';

import { LayoutContainer, MessageContainer } from "./CourseViewerElements";
import { LayoutContentPage } from "../../components/LayoutElements";


function CourseOverview(props: any) {

  const courseId = props.match.params.courseId;
  const accountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");

  const [isTutor, setIsTutor] = useState<Boolean>();
  const [isStudent, setIsStudent] = useState<Boolean>();

  const [course, setCourse] = useState<Course>();
  const [loading, setLoading] = useState<Boolean>(true);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    isTutorByCourseIdAndAccountId(courseId, accountId)
    .then((tmpIsTutor: boolean) => setIsTutor(tmpIsTutor))
    .catch((err) => handleError(err));
    isStudentByCourseIdAndAccountId(courseId, accountId)
    .then((tmpIsStudent: boolean) => setIsStudent(tmpIsStudent))
    .catch((err) => handleError(err));    
    setLoading(false);
  }, [courseId, accountId]);

  useEffect(() => {
    if (isTutor !== undefined && isStudent !== undefined)
    {
      if (!isTutor && !isStudent) {
        secondaryHandleError()                       
      }
    }
  }, [isTutor, isStudent])

  function handleError(err: any): void {
    const errorDataObj = createErrorDataObj(err);
    props.callOpenSnackBar("Error in retrieving course", "error");
    history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
  }

  function createErrorDataObj(err: any): any {
    console.log(err);
    const errorDataObj = { 
        message1: 'Unable to view course',
        message2: err.response.data.message,
        errorStatus: err.response.status,
        returnPath: '/browsecourse',
        returnText: 'Browse Courses'
    }

    return errorDataObj;
  }

  function secondaryHandleError(): void {
    const errorDataObj = {
      message1: 'Unable to view course',
      message2: '',
      errorStatus: 403,
      returnPath: '/browsecourse',
      returnText: 'Browse Courses'
    }
    props.callOpenSnackBar("Error in retrieving course", "error");
    history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
  }

  const showLoading = () => {
    return (
    <MessageContainer>
      <CircularProgress/>
    </MessageContainer>
    );
  }

  const showCourseOverview = () => {
    return (
      <LayoutContainer>
        { showSidebar() }
        <LayoutContentPage showSideBar style={{ paddingRight: "10rem"}}>
        { isTutor &&
          <TutorView courseId={courseId} setCourse={setCourse} callOpenSnackBar={props.callOpenSnackBar} />
        }
        { isStudent &&
          <StudentView courseId={courseId} setCourse={setCourse} callOpenSnackBar={props.callOpenSnackBar} />
        }
        </LayoutContentPage>
      </LayoutContainer>
    );
  }

  const showSidebar = () => {
    return (
    (course !== undefined) &&
      <Sidebar course={course} isTutor={isTutor} isStudent={isStudent} />
    );    
  }

  return (
    <>
      { 
        loading 
          && isTutor === undefined
          && isStudent === undefined
        ? showLoading() 
        : showCourseOverview() 
      }    
    </>
  );
}

const CourseOverviewWithRouter = withRouter(CourseOverview);
export default CourseOverviewWithRouter;
