import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getLessonByLessonId } from "../../../apis/Lesson/LessonApis";
import { getMultimediaByMultimediaId } from "../../../apis/Multimedia/MultimediaApis";
import { Multimedia } from "../../../apis/Entities/Multimedia";
import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";
import { setDateTimeOfCompletionOfEnrolledContentByAccountIdAndContentId } from "../../../apis/EnrolledContent/EnrolledContentApis"

import { Button } from "../../../values/ButtonElements";
import { colours } from "../../../values/Colours";
import ReactPlayer from "react-player";
import { Document, Page } from "react-pdf";
// import FileViewer from 'react-file-viewer';

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
  MultimediaDoneButtonWrapper,
  ExitWrapper
} from "./MultimediaViewerElements";

import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { EnrolledContent } from "../../../apis/Entities/EnrolledContent";
import { useHistory } from "react-router-dom";


function MultimediaViewer(props: any) {
  const contentId = props.match.params.contentId;
  const lessonId = props.match.params.lessonId;
  const courseId = props.match.params.courseId;
  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  const [currentMultimedia, setMultimedia] = useState<Multimedia>();
  const [currentLesson, setLesson] = useState<Lesson>();
  const [currentCourse, setCourse] = useState<Course>();
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  let history = useHistory();

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

  const completeMultimedia = () => {
    setDateTimeOfCompletionOfEnrolledContentByAccountIdAndContentId(true, accountId, contentId)
      .then((res: EnrolledContent) => {
        props.callOpenSnackBar("Multimedia completed", "success");
        history.push(`/overview/lesson/${courseId}/${lessonId}`);
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
          <ExitWrapper to={`/overview/lesson/${currentCourse?.courseId}/${currentLesson?.lessonId}`}>
            <CancelOutlinedIcon fontSize="large" style={{ color: colours.BLUE2, padding: 20 }} />
          </ExitWrapper>
        </PageHeadingAndButton>
        <MultimediaCard>
          <MultimediaHeader>Multimedia Overview</MultimediaHeader>
          <MultimediaName> Name: {currentMultimedia?.name}</MultimediaName>
          <MultimediaDescription> Description: {currentMultimedia?.description}</MultimediaDescription>
        </MultimediaCard>

        <VideoCard>
          {currentMultimedia && currentMultimedia.multimediaType === "VIDEO" &&
            <ReactPlayer
              url={currentMultimedia.url}
              controls={true}
            />
          }
        </VideoCard>

        <PDFCard>
          {currentMultimedia && currentMultimedia.multimediaType === "DOCUMENT" &&
          <Document 
          file= {currentMultimedia?.url}
          onLoadSuccess={onDocumentLoadSuccess}
          >
          <Page pageNumber={pageNumber} />
          </Document>
          }
          <p>Page {pageNumber} of {numPages}</p>
        </PDFCard>

        <ImageCard>
          {currentMultimedia?.multimediaType === "IMAGE" &&
            <img
              src="http://placeimg.com/1200/800/nature"
              // src={currentMultimedia.url}
              width="600"
              style={{ margin: '2px' }}
              alt=""
            />
          }
        </ImageCard>

        {/* <DocViewer pluginRenderers={DocViewerRenderers} documents={docs} /> */}

        {/* <DocumentViewer
          url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          viewer="url"
          style="width:100%;height:50vh;"
        >
        </DocumentViewer> */}

        <MultimediaDoneButtonWrapper>
         <Button primary big fontBig onClick={completeMultimedia}>
           Done
         </Button>
        </MultimediaDoneButtonWrapper>
      </MultimediaContainer>      
    </>
  );
}

const MultimediaViewerWithRouter = withRouter(MultimediaViewer);
export default MultimediaViewerWithRouter;

