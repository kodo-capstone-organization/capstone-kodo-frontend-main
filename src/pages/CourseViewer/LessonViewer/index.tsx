import { useState, useEffect } from "react";
import { withRouter } from "react-router";

import { useHistory } from "react-router-dom";

import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

import { Account } from "../../../apis/Entities/Account";
import { EnrolledContent } from "../../../apis/Entities/EnrolledContent";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";

import { getAccountByEnrolledCourseId } from "../../../apis/Account/AccountApis";
import { getAccountByEnrolledLessonId } from "../../../apis/Account/AccountApis";
import { getEnrolledCourseByEnrolledCourseId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { getEnrolledLessonByEnrolledLessonId } from "../../../apis/EnrolledLesson/EnrolledLessonApis";

import { 
  ExitWrapper, 
  LessonViewerContainerElement
} from "./LessonViewerElements";

import LessonViewerFooter from "./components/LessonViewerFooter";
import LessonViewerHeader from "./components/LessonViewerHeader";
import LessonViewerMultimedia from "./components/LessonViewerMultimedia";
import LessonViewerQuiz from "./components/LessonViewerQuiz";

import { colours } from "../../../values/Colours";


function LessonViewer(props: any) {

  const enrolledCourseId = props.match.params.enrolledCourseId;
  const enrolledLessonId = props.match.params.enrolledLessonId;
  
  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [enrolledLesson, setEnrolledLesson] = useState<EnrolledLesson>();  
  const [enrolledContents, setEnrolledContents] = useState<EnrolledContent[]>();

  const history = useHistory();

  useEffect(() => {
    if (accountId !== null 
        && enrolledCourseId !== null)
    {
      getAccountByEnrolledCourseId(enrolledCourseId).then((account: Account) => {
        if (account.accountId !== accountId)
        {
          history.push('/progresspage');  
        }
      })
      .catch((err) => {
        history.push('/progresspage');
      });
      getEnrolledCourseByEnrolledCourseId(enrolledCourseId).then((enrolledCourse: EnrolledCourse) => {
        setEnrolledCourse(enrolledCourse);
      });
      setLoading(false);
    }
    else
    {
      history.push('/progresspage');
    }
  }, [enrolledCourseId]);

  useEffect(() => {
    if (accountId !== null 
      && enrolledLessonId !== null)
    {
      getAccountByEnrolledLessonId(enrolledLessonId).then((account: Account) => {
        if (account.accountId !== accountId)
        {
          history.push('/progresspage');  
        }
      })
      .catch((err) => {
        history.push('/progresspage');
      });
      getEnrolledLessonByEnrolledLessonId(enrolledLessonId).then((enrolledLesson: EnrolledLesson) => {
        setEnrolledLesson(enrolledLesson);
        setEnrolledContents(enrolledLesson.enrolledContents);
      });
      setLoading(false);
    }
    else
    {
      history.push('/progresspage');
    }
  }, [enrolledLessonId]);

  function previousLessonCompleted(): boolean {
    let allEnrolledLessons = enrolledCourse?.enrolledLessons;
    if (allEnrolledLessons && enrolledLesson && enrolledLesson?.parentLesson.sequence > 1) {
      let sequence = enrolledLesson.parentLesson.sequence
      let pLesson = allEnrolledLessons[sequence - 2];
      if (pLesson.dateTimeOfCompletion !== null) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  return (
    <>
      { (!loading) &&     
        <LessonViewerContainerElement>
          <ExitWrapper to={`/overview/${enrolledCourse?.parentCourse.courseId}`}>
            <CancelOutlinedIcon fontSize="large" style={{ color: colours.BLUE2, padding: 20 }} />
          </ExitWrapper>
          <LessonViewerHeader 
            enrolledCourse={enrolledCourse} 
            enrolledLesson={enrolledLesson} 
          />
          <LessonViewerMultimedia 
            enrolledCourse={enrolledCourse} 
            enrolledLesson={enrolledLesson} 
            enrolledContents={enrolledContents} 
            previousLessonCompleted={previousLessonCompleted}
          />
          <LessonViewerQuiz 
            enrolledCourse={enrolledCourse} 
            enrolledLesson={enrolledLesson} 
            enrolledContents={enrolledContents} 
            previousLessonCompleted={previousLessonCompleted}
          />
          <LessonViewerFooter 
            enrolledCourse={enrolledCourse} 
            enrolledLesson={enrolledLesson} 
          />
        </LessonViewerContainerElement>            
      }
    </>
  );
}

const LessonViewerWithRouter = withRouter(LessonViewer);
export default LessonViewerWithRouter;
