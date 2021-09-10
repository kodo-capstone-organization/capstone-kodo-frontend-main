import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getLessonByLessonId } from "../../../apis/Lesson/LessonApis";
import { getMyAccount } from "../../../apis/Account/AccountApis";

import { Course } from "../../../apis/Entities/Course";
import { Lesson } from "../../../apis/Entities/Lesson";
import { Account } from "../../../apis/Entities/Account";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";


import { Button } from "../../../values/ButtonElements";

import {
  LessonContainer,
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
  BtnWrapper
} from "./LessonViewerElements";
import Sidebar from "../Sidebar/Sidebar";

function LessonViewer(props: any) {
  const lessonId = props.match.params.lessonId;
  const courseId = props.match.params.courseId;
  const [currentCourse, setCourse] = useState<Course>();
  const [currentLesson, setLesson] = useState<Lesson>();
  const [currentUser, setUser] = useState<Account>();
  const [enrolledLesson, setEnrolledLesson] = useState<EnrolledLesson>();
  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    getCourseByCourseId(courseId).then(receivedCourse => {
      setCourse(receivedCourse);
    });
  }, []);

  useEffect(() => {
    getLessonByLessonId(lessonId).then(receivedLesson => {
      setLesson(receivedLesson);
    });
  }, []);

  useEffect(() => {
    getMyAccount(accountId).then(receivedAccount => {
      setUser(receivedAccount);
    });
  }, []);

  function isCourseTutor(course: Course): boolean {
    if (course.tutor.accountId == currentUser?.accountId) {
      return true;
    }
    return false;
  }

  let lessonQuizzes = currentLesson?.quizzes;
  let lessonMultimedias = currentLesson?.multimedias;

  function checkCompleted(courseId: number): boolean  {
    //let item1 = array.find(i => i.id === 1);
    let enrolledContent = enrolledLesson?.enrolledContents.find(i => i.content.contentId === courseId);
    if (enrolledContent?.dateTimeOfCompletion !== null) {
      return true;
    }
    return false;
  }

  return (
    <>
      <LessonContainer>
        <LessonTitle>Week {currentLesson?.sequence}</LessonTitle>
        <CourseTitle>{currentCourse?.name}</CourseTitle>
        <LessonCard>
          <LessonHeader>Lesson Overview</LessonHeader>
          <LessonDescription>{currentLesson?.description}</LessonDescription>
        </LessonCard>
        <LessonCard>
          <LessonHeader>
            Section {currentLesson?.sequence}: {currentLesson?.name} [To Finish]
          </LessonHeader>
          <ContentMenu>
            {lessonMultimedias?.map(m => {
              return (
                <ContentLink key={m.contentId} isCompleted={checkCompleted(m.contentId)}>
                  {m.multimediaType === "PDF" ? <ReadingIcon /> : <PlayIcon />}
                  {m.multimediaType === "PDF" ? "Reading" : "Video"}: {m.name}
                  <CheckIcon />                
                </ContentLink>
              );
            })}
          </ContentMenu>
        </LessonCard>
        <LessonCard>
          <LessonHeader>Quiz</LessonHeader>
          <QuizHeading>{}</QuizHeading>          
          <QuizWrapper>
            {lessonQuizzes?.map(q => {
              return (
            <>
            <QuizRow>
              <QuizSubheader>TIME LIMIT:</QuizSubheader>
              <QuizDescription>{q.timeLimit} H</QuizDescription>
              <BtnWrapper><Button primary={true} big={false} fontBig={false}>Start</Button></BtnWrapper>
            </QuizRow>
            <QuizRow>
              <QuizSubheader>No. Attempts:</QuizSubheader>
              <QuizDescriptionTwo>{q.maxAttemptsPerStudent}</QuizDescriptionTwo>
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
