import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { withRouter } from "react-router";
import { pdfjs } from "react-pdf";

import DownloadFile from "./DownloadFile";
import PDFViewer from "./PDFViewer";
import ReactPlayer from "react-player";

import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Tooltip from '@material-ui/core/Tooltip';

import { Course } from "../../../../entities/Course";
import { EnrolledContent } from "../../../../entities/EnrolledContent";
import { EnrolledCourse } from "../../../../entities/EnrolledCourse";
import { EnrolledLesson } from "../../../../entities/EnrolledLesson";
import { Lesson } from "../../../../entities/Lesson";
import { Multimedia } from "../../../../entities/Multimedia";

import { getEnrolledContentByEnrolledContentIdAndAccountId } from "../../../../apis/EnrolledContentApis";
import { getEnrolledCourseByEnrolledCourseIdAndAccountId } from "../../../../apis/EnrolledCourseApis"
import { getEnrolledLessonByEnrolledLessonIdAndAccountId } from "../../../../apis/EnrolledLessonApis"
import { setDateTimeOfCompletionOfEnrolledContentByEnrolledContentId } from "../../../../apis/EnrolledContentApis";

import {
  CourseTitle,
  DocumentCard,
  ExitLink,
  ExitWrapper,
  ImageCard,
  LessonTitle,
  MultimediaActionButtonWrapper,
  MultimediaActionWrapper,
  MultimediaDescription,
  MultimediaName,
  MultimediaViewerCardElement,
  MultimediaViewerContainerElement,
  MultimediaViewerContentElement,
  MultimediaViewerHeaderElement,
  MultimediaViewerInnerContainerElement,
  MultimediaViewerLine,
  PDFCard,
  VideoCard,
} from "./MultimediaViewerElements";

import { colours } from "../../../../values/Colours";
import { Button } from "../../../../values/ButtonElements";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


function MultimediaViewer(props: any) {

  const enrolledCourseId = props.match.params.enrolledCourseId;
  const enrolledLessonId = props.match.params.enrolledLessonId;
  const enrolledContentId = props.match.params.enrolledContentId;
  
  const [currentMultimedia, setMultimedia] = useState<Multimedia>();
  const [currentLesson, setLesson] = useState<Lesson>();
  const [currentCourse, setCourse] = useState<Course>();
  const [currentEnrolledContent, setEnrolledContent] = useState<EnrolledContent>();

  const accountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");

  let history = useHistory();

  useEffect(() => {
    getEnrolledCourseByEnrolledCourseIdAndAccountId(enrolledCourseId, accountId)
    .then((enrolledCourse: EnrolledCourse) => setCourse(enrolledCourse.parentCourse))
    .catch((err) => handleError(err));       
  }, [enrolledCourseId, accountId]);

  useEffect(() => {
      getEnrolledLessonByEnrolledLessonIdAndAccountId(enrolledLessonId, accountId)
      .then((enrolledLesson: EnrolledLesson) => setLesson(enrolledLesson.parentLesson))
      .catch((err) => handleError(err));      
  }, [enrolledLessonId, accountId]);

  useEffect(() =>
  {
      getEnrolledContentByEnrolledContentIdAndAccountId(enrolledContentId, accountId)
      .then((enrolledContent: EnrolledContent) =>
      {
        setEnrolledContent(enrolledContent);
        setMultimedia(enrolledContent.parentContent as Multimedia);
      })
      .catch(err => handleError(err));
  }, [enrolledContentId, accountId]);

  function handleError(err: any): void {
    const errorDataObj = createErrorDataObj(err);
    props.callOpenSnackBar("Error in retrieving multimedia", "error");
    history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
  }

  function createErrorDataObj(err: any): any {
    const errorDataObj = { 
        message1: 'Unable to view multimedia',
        message2: err.response.data.message,
        errorStatus: err.response.status,
        returnPath: '/progresspage',
        returnText: 'My Progress'
    }

    return errorDataObj;
  }

  function getUrlForDocument() {
    return `https://docs.google.com/gview?url=https://storage.googleapis.com/capstone-kodo-bucket/${currentMultimedia?.urlFilename}&embedded=true`
  }

  const completeMultimedia = () => {
    setDateTimeOfCompletionOfEnrolledContentByEnrolledContentId(true, enrolledContentId)
      .then((res: EnrolledContent) => {
        props.callOpenSnackBar("Multimedia completed", "success");
        history.push(`/overview/course/${enrolledCourseId}/lesson/${enrolledLessonId}`);
      })
      .catch(err => props.callOpenSnackBar(err.response.data.message, "error"))
  }

  const showBackToLessonOverviewIcon = () => {
    return (
      <ExitWrapper>
          <ExitLink to={`/overview/course/${enrolledCourseId}/lesson/${enrolledLessonId}`}>
              <Tooltip title={<div style={{ fontSize: "1.5em", padding: "2px" }}>Back to Lesson Overview</div>}>
                  <CancelOutlinedIcon fontSize="large" style={{ color: colours.BLUE2, padding: 20 }} />
              </Tooltip>
          </ExitLink>
      </ExitWrapper>
    );
  }

  const showLessonOverview = () => {
    return (
      <>
        { currentLesson !== undefined &&
          currentCourse !== undefined &&
          currentEnrolledContent !== undefined &&
            <MultimediaViewerCardElement>
                <MultimediaViewerHeaderElement title="Lesson Overview"/>
                <MultimediaViewerContentElement>
                    <LessonTitle>Week {currentLesson.sequence}</LessonTitle>
                    <CourseTitle>{currentCourse.name}</CourseTitle>
                    <MultimediaViewerLine/>
                    { currentLesson.description }    
                </MultimediaViewerContentElement>
            </MultimediaViewerCardElement>
        }
      </>
    );
  }

  const showMultimediaOverview = () => {
    return (
      <>
        { currentMultimedia !== undefined &&
          <MultimediaViewerCardElement>
              <MultimediaViewerHeaderElement title="Multimedia"/>
              <MultimediaViewerContentElement>
                  <MultimediaName>Name: {currentMultimedia.name}</MultimediaName>
                  <MultimediaDescription>Description: {currentMultimedia.description}</MultimediaDescription>
                  <MultimediaViewerLine/>
                  { showMultimediaActions() }
                  <MultimediaViewerLine/>
                  { showMultimedia() }
              </MultimediaViewerContentElement>
          </MultimediaViewerCardElement>
        }
      </>
    );
  }

  const showMultimediaActions = () => {
    return (
      <MultimediaActionWrapper>
        <MultimediaActionButtonWrapper>
          <DownloadFile multimediaName={currentMultimedia?.name} multimediaUrl={currentMultimedia?.url} />
        </MultimediaActionButtonWrapper>
        <MultimediaActionButtonWrapper>
          { currentEnrolledContent?.dateTimeOfCompletion === null &&
              <Button primary onClick={completeMultimedia}>
                Mark as Done
              </Button>
          }
        </MultimediaActionButtonWrapper>
      </MultimediaActionWrapper>
    )
  }

  const showMultimedia = () => {
    return (
      <>
      {currentMultimedia && currentMultimedia.multimediaType === "VIDEO" &&
        <VideoCard>
          <ReactPlayer
            url={currentMultimedia.url}
            controls={true}
          />
        </VideoCard>
      }

      {currentMultimedia && currentMultimedia.multimediaType === "PDF" &&
        <PDFCard>
          <PDFViewer doc={currentMultimedia.url} />
        </PDFCard>
      }

      {currentMultimedia?.multimediaType === "IMAGE" &&
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }} >
          <ImageCard>
            <img alt={currentMultimedia?.name}
              src={currentMultimedia.url}
              width="600"
            />
          </ImageCard>
        </div>
      }

      {currentMultimedia?.multimediaType === "DOCUMENT" &&
        <DocumentCard>
          <iframe title="docx-view" width="560" height="780" src={getUrlForDocument()}>
          </iframe>
        </DocumentCard>
      }
      </>
    );
  }

  return (
      <MultimediaViewerContainerElement>
        <MultimediaViewerInnerContainerElement>
          { showBackToLessonOverviewIcon() }
          { showLessonOverview() }
          { showMultimediaOverview() }
        </MultimediaViewerInnerContainerElement>
      </MultimediaViewerContainerElement>

  );
}

const MultimediaViewerWithRouter = withRouter(MultimediaViewer);
export default MultimediaViewerWithRouter;