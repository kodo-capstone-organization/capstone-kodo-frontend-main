import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getLessonByLessonId } from "../../../apis/Lesson/LessonApis";
import { getMyAccount } from "../../../apis/Account/AccountApis";
import { getEnrolledLesson } from "../../../apis/EnrolledLesson/EnrolledLessonApis";
import { getEnrolledCourseByStudentIdAndCourseId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { getNumberOfStudentAttemptsLeft } from "../../../apis/StudentAttempt/StudentAttemptApis"
import { getAllQuizzesWithStudentAttemptCountByEnrolledLessonId } from "../../../apis/Quiz/QuizApis";

import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";
import { Account } from "../../../apis/Entities/Account";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { QuizWithStudentAttemptCountResp } from "../../../apis/Entities/Quiz"

import { Button } from "../../../values/ButtonElements";
import { colours } from "../../../values/Colours";


import {
  LessonContainer,
  PageHeadingAndButton,
  PageHeading,
  LessonTitle,
  CourseTitle,
  LessonCard,
  LessonDescription,
  LessonHeader,
  ContentMenu,
  ContentLink,
  ReadingIcon,
  PlayIcon,
  QuizWrapper,
  QuizRow,
  QuizHeading,
  QuizSubheader,
  QuizDescription,
  QuizDescriptionTwo,
  CheckIcon,
  BtnWrapper,
  ExitWrapper,
  ExitIcon,
  ExitText
} from "./LessonViewerElements";
import Sidebar from "../Sidebar/Sidebar";

import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';


function LessonViewer(props: any) {
  const lessonId = props.match.params.lessonId;
  const courseId = props.match.params.courseId;
  const [currentCourse, setCourse] = useState<Course>();
  const [currentLesson, setLesson] = useState<Lesson>();
  const [currentUser, setUser] = useState<Account>();
  const [enrolledLesson, setEnrolledLesson] = useState<EnrolledLesson>();
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [quizAttempts, setQuizAttempts] = useState<QuizWithStudentAttemptCountResp[]>();
  const [previousLesson, setPreviousLesson] = useState<EnrolledLesson>();
  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    getCourseByCourseId(courseId).then(receivedCourse => {
      setCourse(receivedCourse);
    });
    getLessonByLessonId(lessonId).then(receivedLesson => {
      setLesson(receivedLesson);
    });
    getMyAccount(accountId).then(receivedAccount => {
      setUser(receivedAccount);
    });
    getEnrolledLesson(accountId, lessonId).then(receivedEnrolledLesson => {
      setEnrolledLesson(receivedEnrolledLesson);
    });
    getAllQuizzesWithStudentAttemptCountByEnrolledLessonId(lessonId).then(receivedQuizAttempts => {
      setQuizAttempts(receivedQuizAttempts);
    });
  }, []);

  useEffect(() => {
    console.log(accountId, courseId)
    if (accountId !== null && courseId !== null ) {
      getEnrolledCourseByStudentIdAndCourseId(accountId, courseId).then(receivedEnrolledCourse => {
        setEnrolledCourse(receivedEnrolledCourse);
      });
    }
  }, []);


  let allEnrolledLessons = enrolledCourse?.enrolledLessons;
  if (allEnrolledLessons && enrolledLesson && enrolledLesson?.parentLesson.sequence > 1) {
    setPreviousLesson(allEnrolledLessons[(enrolledLesson.parentLesson.sequence) - 2])
  }

  let isCourseTutor =
    currentCourse?.tutor.accountId === currentUser?.accountId ? true : false;


  let lessonMultimedias = currentLesson?.multimedias;

  function checkCompleted(contentId: number): boolean {
    let enrolledContent = enrolledLesson?.enrolledContents.find(
      i => i.parentContent?.contentId === contentId
    );
    if (enrolledContent?.dateTimeOfCompletion !== null || isCourseTutor) {
      return true;
    }
    return false;
  }


  return (
    <>
      <LessonContainer>
      <PageHeadingAndButton>
        <PageHeading>
          <LessonTitle>Week {currentLesson?.sequence}</LessonTitle>
          <CourseTitle>{currentCourse?.name}</CourseTitle> 
        </PageHeading>
        <ExitWrapper to={`/overview/${currentCourse?.courseId}`}>
            <CancelOutlinedIcon fontSize="large" style={{ color: colours.BLUE2, padding: 20 }}/>
        </ExitWrapper>
      </PageHeadingAndButton>
        <LessonCard>
          <LessonHeader>Lesson Overview</LessonHeader>
          <LessonDescription>{currentLesson?.description}</LessonDescription>
        </LessonCard>
        <LessonCard>
          <LessonHeader>
            Section {currentLesson?.sequence}: {currentLesson?.name}
          </LessonHeader>
          <ContentMenu>
            {lessonMultimedias?.map(m => {
              return (
                <ContentLink
                  key={m.contentId}
                  isCompleted={checkCompleted(m.contentId)}
                >
                  {m.multimediaType === "PDF" ? <ReadingIcon /> : <PlayIcon />}
                  {m.multimediaType === "PDF" ? "Reading" : "Video"}: {m.name}
                  {checkCompleted(m.contentId) &&
                  <CheckIcon />
                  }
                </ContentLink>
              );
            })}
          </ContentMenu>
        </LessonCard>
        <LessonCard>
          <LessonHeader>Quiz</LessonHeader>
          <QuizHeading>{}</QuizHeading>
          <QuizWrapper>
            {quizAttempts?.map(q => {
              return (
                <>
                  <QuizRow>
                    <QuizSubheader>TIME LIMIT:</QuizSubheader>
                    <QuizDescription>{q.timeLimit} H</QuizDescription>
                    <BtnWrapper>
                      {q.studentAttemptCount == 0 &&
                      <Button disabled>
                        Start
                      </Button>
                      }
                      {q.studentAttemptCount > 0 &&
                      <Button primary={true} big={false} fontBig={false} disabled={false}>
                        Start
                      </Button>
                      }
                    </BtnWrapper>
                  </QuizRow>
                  <QuizRow>
                    <QuizSubheader>No. Attempts:</QuizSubheader>
                    <QuizDescriptionTwo>
                      {q.maxAttemptsPerStudent}
                    </QuizDescriptionTwo>
                    {/*
                    <QuizSubheader>Grade:</QuizSubheader>
                    <QuizDescriptionTwo>[To Finish]</QuizDescriptionTwo>
                    */}
                  </QuizRow>
                </>
              );
            })}
          </QuizWrapper>
        </LessonCard>
      </LessonContainer>
    </>
  );
}

const LessonViewerWithRouter = withRouter(LessonViewer);
export default LessonViewerWithRouter;
