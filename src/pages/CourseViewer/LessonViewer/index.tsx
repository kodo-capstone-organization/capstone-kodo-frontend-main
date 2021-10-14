import { useState, useEffect } from "react";
import { withRouter } from "react-router";

import { useHistory } from "react-router-dom";

import { EnrolledContent } from "../../../apis/Entities/EnrolledContent";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";

import { getEnrolledCourseByEnrolledCourseIdAndAccountId } from "../../../apis/EnrolledCourse/EnrolledCourseApis"
import { getEnrolledLessonByEnrolledLessonIdAndAccountId } from "../../../apis/EnrolledLesson/EnrolledLessonApis"

import { 
  LessonViewerContainerElement,
  LessonViewerInnerContainerElement
} from "./LessonViewerElements";

import LessonViewerFooter from "./components/LessonViewerFooter";
import LessonViewerHeader from "./components/LessonViewerHeader";
import LessonViewerMultimedia from "./components/LessonViewerMultimedia";
import LessonViewerQuiz from "./components/LessonViewerQuiz";


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
    setLoading(true);
    getEnrolledCourseByEnrolledCourseIdAndAccountId(enrolledCourseId, accountId)
    .then((enrolledCourse: EnrolledCourse) => setEnrolledCourse(enrolledCourse))
    .catch((err) => handleError(err));    
    setLoading(false);   
  }, [enrolledCourseId, accountId]);

  useEffect(() => {
    setLoading(true);
    getEnrolledLessonByEnrolledLessonIdAndAccountId(enrolledLessonId, accountId)
    .then((enrolledLesson: EnrolledLesson) => {
      setEnrolledLesson(enrolledLesson);
      setEnrolledContents(enrolledLesson.enrolledContents);
    })
    .catch((err) => handleError(err));      
    setLoading(false);   
  }, [enrolledLessonId, accountId]);

  function handleError(err: any): void {
    const errorDataObj = createErrorDataObj(err);
    props.callOpenSnackBar("Error in retrieving lesson", "error");
    history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
  }

  function createErrorDataObj(err: any): any {
    const errorDataObj = { 
        message1: 'Unable to view lesson',
        message2: err.response.data.message,
        errorStatus: err.response.status,
        returnPath: '/progresspage',
        returnText: 'Progress Page'
    }

    return errorDataObj;
  }

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
          <LessonViewerInnerContainerElement>
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
          </LessonViewerInnerContainerElement>
        </LessonViewerContainerElement>            
      }
    </>
  );
}

const LessonViewerWithRouter = withRouter(LessonViewer);
export default LessonViewerWithRouter;
