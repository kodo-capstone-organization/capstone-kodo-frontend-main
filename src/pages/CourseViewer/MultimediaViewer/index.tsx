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
import ControlPanel from "./ControlPanel";
import PDFViewer from "./PDFViewer";

import {
  MultimediaContainer,
  PageHeadingAndButton,
  PageHeading,
  LessonTitle,
  CourseTitle,
  MultimediaCard,
  VideoCard,
  PDFCard,
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
  const [scale, setScale] = useState(1.0);


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

  const file = '/assets/sample-word.docx';
  const type = 'docx';

  return (
    <>
      <FileViewer
      fileType={type}
      filePath={file}
      />
      <PDFCard>
      <iframe src='https://view.officeapps.live.com/op/embed.aspx?src=http%3A%2F%2Fieee802%2Eorg%3A80%2Fsecmail%2FdocIZSEwEqHFr%2Edoc' width='100%' height='100%'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
      </iframe>
      </PDFCard>
      
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

        {currentMultimedia && currentMultimedia.multimediaType === "DOCUMENT" &&
        <PDFCard>
          {/* <PDFViewer doc={"/assets/file-sample.pdf"} /> */}
          <PDFViewer doc={currentMultimedia.url} />
        </PDFCard>  
        }

        {/* <PDFCard>
          {currentMultimedia && currentMultimedia.multimediaType === "DOCUMENT" &&
            <>
              <ControlPanel
                scale={scale}
                setScale={setScale}
                numPages={numPages}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                file={currentMultimedia?.url}
                // file="/assets/file-sample.pdf"
              />
              <Document
                file= {currentMultimedia?.url}
                // file="/assets/file-sample.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} scale={scale} />
                <div>Page {pageNumber} of {numPages}</div>
              </Document>
            </>
          }
        </PDFCard> */}
        
        {currentMultimedia?.multimediaType === "IMAGE" &&
        <ImageCard>  
            <img
              src="http://placeimg.com/1200/800/nature"
              // src={currentMultimedia.url}
              width="600"
              style={{ margin: '2px' }}
              alt=""
            />
        </ImageCard>
        }
        {/* <DocViewer pluginRenderers={DocViewerRenderers} documents={docs} /> */}

        {/* <DocumentViewer
          url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          viewer="url"
          style="width:100%;height:50vh;"
        >
        </DocumentViewer> */}


      </MultimediaContainer>
    </>
  );
}

const MultimediaViewerWithRouter = withRouter(MultimediaViewer);
export default MultimediaViewerWithRouter;

