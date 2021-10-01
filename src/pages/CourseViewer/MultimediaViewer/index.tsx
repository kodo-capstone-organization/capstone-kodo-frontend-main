import { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getLessonByLessonId } from "../../../apis/Lesson/LessonApis";
import { getMultimediaByMultimediaId } from "../../../apis/Multimedia/MultimediaApis";
import { Multimedia } from "../../../apis/Entities/Multimedia";
import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";

import { colours } from "../../../values/Colours";
import ReactPlayer from "react-player";
import { pdfjs } from "react-pdf";
import PDFViewer from "./PDFViewer";
import DownloadFile from "./DownloadFile";

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

import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function MultimediaViewer(props: any) {
  const contentId = props.match.params.contentId;
  const lessonId = props.match.params.lessonId;
  const courseId = props.match.params.courseId;

  const [currentMultimedia, setMultimedia] = useState<Multimedia>();
  const [currentLesson, setLesson] = useState<Lesson>();
  const [currentCourse, setCourse] = useState<Course>();
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    getMultimediaByMultimediaId(contentId).then(receivedMultimedia => {
      setMultimedia(receivedMultimedia);
    });
    getLessonByLessonId(lessonId).then(receivedLesson => {
      setLesson(receivedLesson);
    });
    getCourseByCourseId(courseId).then(receivedCourse => {
      setCourse(receivedCourse);
    });
  }, [contentId, lessonId, courseId]);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  function getUrlForDocument() {
    return `https://docs.google.com/gview?url=https://storage.googleapis.com/capstone-kodo-bucket/${currentMultimedia?.urlFilename}&embedded=true`
  }

  return (
    <>
      <MultimediaContainer>
        <PageHeadingAndButton>
          <PageHeading>
            <LessonTitle>Week {currentLesson?.sequence}</LessonTitle>
            <CourseTitle>{currentCourse?.name}</CourseTitle>
          </PageHeading>
          <ExitWrapper to={`/overview/lesson/${currentCourse?.courseId}/${currentLesson?.lessonId}`}>
            <CancelOutlinedIcon fontSize="large" style={{ color: colours.BLUE2, padding: 20 }} />
          </ExitWrapper>
        </PageHeadingAndButton>
        <MultimediaCard>
          <MultimediaHeader>Multimedia Overview</MultimediaHeader>
          <MultimediaName> Name: {currentMultimedia?.name}</MultimediaName>
          <MultimediaDescription> Description: {currentMultimedia?.description}</MultimediaDescription>
        </MultimediaCard>

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
              <img
                src={currentMultimedia.url}
                width="600"
              />
            </ImageCard>
          </div>
        }

        {currentMultimedia?.multimediaType === "DOCUMENT" &&
          <DocumentCard>
            <iframe
              width="560" height="780" src={getUrlForDocument()}>
            </iframe>
          </DocumentCard>
        }

        <DownloadFile multimediaName={currentMultimedia?.name} multimediaUrl={currentMultimedia?.url} />

      </MultimediaContainer>
    </>
  );
}

const MultimediaViewerWithRouter = withRouter(MultimediaViewer);
export default MultimediaViewerWithRouter;