import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getLessonByLessonId } from "../../../apis/Lesson/LessonApis";
import { getMyAccount } from "../../../apis/Account/AccountApis";
import { getEnrolledLesson } from "../../../apis/EnrolledLesson/EnrolledLessonApis";
import { getEnrolledCourseByStudentIdAndCourseId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { getMultimediaByMultimediaId } from "../../../apis/Multimedia/MultimediaApis";
import { Multimedia } from "../../../apis/Entities/Multimedia";
import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";
import { Account } from "../../../apis/Entities/Account";
import { Quiz } from "../../../apis/Entities/Quiz";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { QuizWithStudentAttemptCountResp } from "../../../apis/Entities/Quiz"

import { Button } from "../../../values/ButtonElements";
import { colours } from "../../../values/Colours";
import ReactPlayer from "react-player";
import { Document, Page, pdfjs } from "react-pdf";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { DocumentViewer } from 'react-documents';
import FileViewer from 'react-file-viewer';
import { saveAs } from "file-saver";
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
          <ImageCard>
            <img
              // src="https://storage.googleapis.com/download/storage/v1/b/capstone-kodo-bucket/o/54ac91ee-583b-4cfd-99e9-1540388bb952.png?generation=1632977979927790&alt=media"
              src={currentMultimedia.url}
              width="600"
              style={{ margin: '2px' }}
            />
          </ImageCard>
        }

        {currentMultimedia?.multimediaType === "DOCUMENT" &&
          <DocumentCard>
            <iframe
              width="560" height="780" src="https://docs.google.com/gview?url=https://storage.googleapis.com/capstone-kodo-bucket/59f5e0e2-4352-4f32-8284-03358463acab.docx&embedded=true">
            </iframe>
          </DocumentCard>
        }

        <DownloadFile multimediaType={currentMultimedia?.multimediaType} multimediaName={currentMultimedia?.name} multimediaUrl={currentMultimedia?.url} />

      </MultimediaContainer>
    </>
  );
}

const MultimediaViewerWithRouter = withRouter(MultimediaViewer);
export default MultimediaViewerWithRouter;