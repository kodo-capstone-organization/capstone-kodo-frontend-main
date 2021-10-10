import { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { getMultimediaByMultimediaId } from "../../../apis/Multimedia/MultimediaApis";
import { getEnrolledContentByAccountIdAndContentId } from "../../../apis/EnrolledContent/EnrolledContentApis"
import { Multimedia } from "../../../apis/Entities/Multimedia";
import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";
import { colours } from "../../../values/Colours";
import ReactPlayer from "react-player";

import DownloadFile from "./DownloadFile";
import { pdfjs } from "react-pdf";

import {
  MultimediaContainer,
  PageHeadingAndButton,
  PageHeading,
  LessonTitle,
  CourseTitle,
  MultimediaCard,
  VideoCard,
  PDFCard,
  DocumentCard,
  ImageCard,
  MultimediaName,
  MultimediaDescription,
  MultimediaHeader,
  ExitWrapper
} from "./MultimediaViewerElements";

import { getEnrolledCourseByEnrolledCourseId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { getEnrolledLessonByEnrolledLessonId } from "../../../apis/EnrolledLesson/EnrolledLessonApis";
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { EnrolledContent } from "../../../apis/Entities/EnrolledContent";
import { useHistory } from "react-router-dom";
import { Button } from "../../../values/ButtonElements";
import { setDateTimeOfCompletionOfEnrolledContentByAccountIdAndContentId } from "../../../apis/EnrolledContent/EnrolledContentApis";
import PDFViewer from "./PDFViewer";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function MultimediaViewer(props: any) {

  const enrolledCourseId = props.match.params.enrolledCourseId;
  const enrolledLessonId = props.match.params.enrolledLessonId;
  const contentId = props.match.params.contentId;
  
  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  const [currentMultimedia, setMultimedia] = useState<Multimedia>();
  const [currentLesson, setLesson] = useState<Lesson>();
  const [currentCourse, setCourse] = useState<Course>();
  const [currentEnrolledContent, setEnrolledContent] = useState<EnrolledContent>();

  let history = useHistory();

  useEffect(() => {
    getMultimediaByMultimediaId(contentId).then(receivedMultimedia => {
      setMultimedia(receivedMultimedia);
    });
    getEnrolledContentByAccountIdAndContentId(accountId, contentId).then(receivedContent => {
      setEnrolledContent(receivedContent);
    })
    getEnrolledLessonByEnrolledLessonId(enrolledLessonId).then(enrolledLesson => {
      setLesson(enrolledLesson.parentLesson);
    })
    getEnrolledCourseByEnrolledCourseId(enrolledCourseId).then(enrolledCourse => {
      setCourse(enrolledCourse.parentCourse);
    })
  }, [enrolledCourseId, enrolledLessonId, contentId]);

  function getUrlForDocument() {
    return `https://docs.google.com/gview?url=https://storage.googleapis.com/capstone-kodo-bucket/${currentMultimedia?.urlFilename}&embedded=true`
  }

  const completeMultimedia = () => {
    setDateTimeOfCompletionOfEnrolledContentByAccountIdAndContentId(true, accountId, contentId)
      .then((res: EnrolledContent) => {
        props.callOpenSnackBar("Multimedia completed", "success");
        history.push(`/overview/lesson/${enrolledCourseId}/${enrolledLessonId}`);
      })
      .catch(err => props.callOpenSnackBar(err.response.data.message, "error"))
  }

  return (
    <>
      <MultimediaContainer>
        <PageHeadingAndButton>
          <PageHeading>
            <LessonTitle>Week {currentLesson?.sequence}</LessonTitle>
            <CourseTitle>{currentCourse?.name}</CourseTitle>
          </PageHeading>
          <ExitWrapper to={`/overview/lesson/${enrolledCourseId}/${enrolledLessonId}`}>
            <CancelOutlinedIcon fontSize="large" style={{ color: colours.BLUE2, padding: 20 }} />
          </ExitWrapper>
        </PageHeadingAndButton>
        <MultimediaCard>
          <MultimediaHeader>Multimedia Overview</MultimediaHeader>
          <MultimediaName> <strong>Name: </strong> {currentMultimedia?.name}</MultimediaName>
          <MultimediaDescription> <strong>Description: </strong> <p style={{ whiteSpace: 'pre'}}>{currentMultimedia?.description}</p></MultimediaDescription>
        </MultimediaCard>

        <div id="action-row" style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
          <DownloadFile multimediaName={currentMultimedia?.name} multimediaUrl={currentMultimedia?.url} />
          &nbsp;&nbsp;
          {currentEnrolledContent?.dateTimeOfCompletion === null &&
          <Button primary onClick={completeMultimedia}>
            Mark as Done
          </Button>
          }
        </div>

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

      </MultimediaContainer>
    </>
  );
}

const MultimediaViewerWithRouter = withRouter(MultimediaViewer);
export default MultimediaViewerWithRouter;