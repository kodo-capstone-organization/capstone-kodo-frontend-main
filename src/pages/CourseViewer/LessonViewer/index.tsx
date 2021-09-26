import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getLessonByLessonId } from "../../../apis/Lesson/LessonApis";
import { getMyAccount } from "../../../apis/Account/AccountApis";
import { getEnrolledLesson } from "../../../apis/EnrolledLesson/EnrolledLessonApis";
import { getEnrolledCourseByStudentIdAndCourseId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";

import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";
import { Account } from "../../../apis/Entities/Account";
import { Quiz } from "../../../apis/Entities/Quiz";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { QuizWithStudentAttemptCountResp } from "../../../apis/Entities/Quiz"

import { Button } from "../../../values/ButtonElements";
import { colours } from "../../../values/Colours";


import {
  LessonContainer,
  PageHeadingAndButton,
  PageHeading,
  HeadingDescription,
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
  ExitWrapper
} from "./LessonViewerElements";

import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';


function LessonViewer(props: any) {
  const lessonId = props.match.params.lessonId;
  const courseId = props.match.params.courseId;
  const [currentCourse, setCourse] = useState<Course>();
  const [currentLesson, setLesson] = useState<Lesson>();
  const [currentUser, setUser] = useState<Account>();
  const [enrolledLesson, setEnrolledLesson] = useState<EnrolledLesson>();
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
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
  }, []);

  useEffect(() => {
    if (accountId !== null && courseId !== null ) {
      getEnrolledCourseByStudentIdAndCourseId(accountId, courseId).then(receivedEnrolledCourse => {
        setEnrolledCourse(receivedEnrolledCourse);
      });
    }
  }, []);


  function getQuizAttempts(): QuizWithStudentAttemptCountResp[] {
    let quizAttemptsTemp: QuizWithStudentAttemptCountResp[] = [];
    enrolledLesson?.enrolledContents.forEach(enrolledContent => {
      if ("maxAttemptsPerStudent" in enrolledContent.parentContent)
      {
        let quiz: Quiz = enrolledContent.parentContent as Quiz; 
        let studentAttemptCount;
        
        if (enrolledContent.studentAttempts)
        {
          studentAttemptCount = quiz.maxAttemptsPerStudent - enrolledContent.studentAttempts.length;
        }
        else
        {
          studentAttemptCount = quiz.maxAttemptsPerStudent;
        }

        quizAttemptsTemp.push(
          {
            contentId: enrolledContent.enrolledContentId,
            timeLimit: quiz.timeLimit,
            maxAttemptsPerStudent: quiz.maxAttemptsPerStudent,
            studentAttemptCount: studentAttemptCount                 
          }        
        );
      }
    });
    return quizAttemptsTemp;
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
          {!previousLessonCompleted() &&
          <HeadingDescription>You do not have access to this page. Complete your previous lessons.</HeadingDescription>
          }
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
                  previousCompleted={previousLessonCompleted()}
                  to={`/overview/lesson/${courseId}/${lessonId}/${m.contentId}`}
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
            {getQuizAttempts()?.map(q => {
              return (
                <>
                  <QuizRow>
                    <QuizSubheader>TIME LIMIT:</QuizSubheader>
                    <QuizDescription>{q.timeLimit} H</QuizDescription>
                    <BtnWrapper>
                      {!previousLessonCompleted() && 
                      <Button disabled>
                        Start
                      </Button>
                      }
                      {previousLessonCompleted() && q.studentAttemptCount === 0 &&
                      <Button disabled>
                        Start
                      </Button>
                      }
                      {previousLessonCompleted() && q.studentAttemptCount > 0 && 
                      <Button primary={true} big={false} fontBig={false} disabled={false}>
                        Start
                      </Button>
                      }
                    </BtnWrapper>
                  </QuizRow>
                  <QuizRow>
                    <QuizSubheader>No. Attempts Left:</QuizSubheader>
                    <QuizDescriptionTwo>
                      {q.studentAttemptCount}
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
