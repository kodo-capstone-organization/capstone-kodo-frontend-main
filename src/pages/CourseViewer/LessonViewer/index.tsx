import { useState, useEffect } from "react";
import { withRouter } from "react-router";

import { useHistory } from "react-router-dom";

import { Link } from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

import { Account } from "../../../apis/Entities/Account";
import { Course } from "../../../apis/Entities/Course";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";
import { Lesson } from "../../../apis/Entities/Lesson";
import { Quiz } from "../../../apis/Entities/Quiz";
import { QuizWithStudentAttemptCountResp } from "../../../apis/Entities/Quiz";

import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getEnrolledCourseByStudentIdAndCourseId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { getEnrolledLesson } from "../../../apis/EnrolledLesson/EnrolledLessonApis";
import { getLessonByLessonId } from "../../../apis/Lesson/LessonApis";
import { getMyAccount } from "../../../apis/Account/AccountApis";

import {
  ArrowBackward,
  ArrowForward, 
  BtnWrapper,
  CheckIcon,
  ContentLink,
  ContentMenu,
  CourseTitle,
  ExitWrapper,
  HeadingDescription,
  Image,
  LessonCard,
  LessonContainer,
  LessonDescription,
  LessonHeader,
  LessonTitle,
  NextBtnWrapper,
  PageHeading,
  PageHeadingAndButton,
  PlayIcon,
  PrevBtnWrapper,
  QuizDescription,
  QuizDescriptionTwo,
  QuizRow,
  QuizSubheader,
  QuizWrapper,
  ReadingIcon,
  ZipIcon,
} from "./LessonViewerElements";

import ViewQuizAttemptsModal from './components/ViewQuizAttemptsModal';

import { Button } from "../../../values/ButtonElements";
import { colours } from "../../../values/Colours";


function LessonViewer(props: any) {
  // const lessonId = props.match.params.lessonId;
  // const courseId = props.match.params.courseId;
  // const [currentCourse, setCourse] = useState<Course>();
  // const [currentLesson, setLesson] = useState<Lesson>();
  // const [currentUser, setUser] = useState<Account>();
  // const [enrolledLesson, setEnrolledLesson] = useState<EnrolledLesson>();
  // const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  // const [hover, setHover] = useState(false);
  // const accountId = JSON.parse(
  //   window.sessionStorage.getItem("loggedInAccountId") || "{}"
  // );
  // const [loading, setLoading] = useState<boolean>(true);

  // const history = useHistory();

  // useEffect(() => {
  //   getCourseByCourseId(courseId).then(receivedCourse => {
  //     setCourse(receivedCourse);
  //   });
  //   getLessonByLessonId(lessonId).then(receivedLesson => {
  //     setLesson(receivedLesson);
  //   });
  //   getMyAccount(accountId).then(receivedAccount => {
  //     setUser(receivedAccount);
  //   });
  //   getEnrolledLesson(accountId, lessonId).then(receivedEnrolledLesson => {
  //     setEnrolledLesson(receivedEnrolledLesson);
  //   });
  //   if (accountId !== null && courseId !== null) {
  //     getEnrolledCourseByStudentIdAndCourseId(accountId, courseId).then(receivedEnrolledCourse => {
  //       setEnrolledCourse(receivedEnrolledCourse);
  //       setLoading(false)
  //     });
  //   }
  // }, []);

  // function formatDate(date: Date): string {
  //   var d = new Date(date);
  //   return d.toDateString() + ', ' + d.toLocaleTimeString();
  // }

  // const attemptQuiz = (enrolledContentId: number) => {
  //   history.push({ pathname: `/attemptquizviewer/${enrolledContentId}`, state: { mode: 'ATTEMPT' } });
  // }

  // const getLessonIdToNavigateTo = (lessonSequence: number) => {
  //   const enrolledLessonObj = enrolledCourse?.enrolledLessons.find((enrolledLesson: EnrolledLesson) => enrolledLesson.parentLesson.sequence === lessonSequence)
  //   return enrolledLessonObj?.parentLesson?.lessonId || lessonId;
  // }

  // function getQuizAttempts(): QuizWithStudentAttemptCountResp[] {
  //   let quizAttemptsTemp: QuizWithStudentAttemptCountResp[] = [];
  //   enrolledLesson?.enrolledContents.forEach(enrolledContent => {
  //     if ("maxAttemptsPerStudent" in enrolledContent.parentContent) {
  //       let quiz: Quiz = enrolledContent.parentContent as Quiz;
  //       let studentAttemptCount;

  //       if (enrolledContent.studentAttempts) {
  //         studentAttemptCount = quiz.maxAttemptsPerStudent - enrolledContent.studentAttempts.length;
  //       }
  //       else {
  //         studentAttemptCount = quiz.maxAttemptsPerStudent;
  //       }

  //       quizAttemptsTemp.push(
  //         {
  //           contentId: enrolledContent.enrolledContentId,
  //           timeLimit: quiz.timeLimit,
  //           maxAttemptsPerStudent: quiz.maxAttemptsPerStudent,
  //           studentAttemptCount: studentAttemptCount,
  //           studentAttempts: enrolledContent.studentAttempts
  //         }
  //       );
  //     }
  //   });
  //   return quizAttemptsTemp;
  // }

  // function previousLessonCompleted(): boolean {
  //   let allEnrolledLessons = enrolledCourse?.enrolledLessons;
  //   if (allEnrolledLessons && enrolledLesson && enrolledLesson?.parentLesson.sequence > 1) {
  //     let sequence = enrolledLesson.parentLesson.sequence
  //     let pLesson = allEnrolledLessons[sequence - 2];
  //     if (pLesson.dateTimeOfCompletion !== null) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  // let isCourseTutor =
  //   currentCourse?.tutor.accountId === currentUser?.accountId ? true : false;

  // let lessonCompleted = enrolledLesson?.dateTimeOfCompletion;


  // let lessonMultimedias = currentLesson?.multimedias;

  // function checkCompleted(contentId: number): boolean {

  //   if (contentId) {
  //     let enrolledContent = enrolledLesson?.enrolledContents.find(
  //         i => i.parentContent?.contentId === contentId
  //     );
  //     if (enrolledContent?.dateTimeOfCompletion !== null ) {
  //       return true;
  //     }
  //     return false;
  //   } else {
  //     return false;
  //   }
  // }

  return (
    <>
      { 
        // !loading &&
        // <LessonContainer>
        //   <PageHeadingAndButton>
        //     <PageHeading>
        //       <LessonTitle>Week {currentLesson?.sequence}</LessonTitle>
        //       <CourseTitle>{currentCourse?.name}</CourseTitle>
        //       {!previousLessonCompleted() &&
        //         <HeadingDescription>You do not have access to this page. Complete your previous lessons.</HeadingDescription>
        //       }
        //     </PageHeading>
        //     <ExitWrapper to={`/overview/${courseId}`}>
        //       <CancelOutlinedIcon fontSize="large" style={{ color: colours.BLUE2, padding: 20 }} />
        //     </ExitWrapper>
        //   </PageHeadingAndButton>
        //   <LessonCard>
        //     <LessonHeader>Lesson Overview</LessonHeader>
        //     <LessonDescription>{currentLesson?.description}</LessonDescription>
        //   </LessonCard>
        //   <LessonCard>
        //     <LessonHeader>
        //       Section {currentLesson?.sequence}: {currentLesson?.name}
        //     </LessonHeader>
        //     <ContentMenu>
        //       {lessonMultimedias?.map(m => {
        //         return (
        //           <ContentLink
        //             key={m.contentId} 
        //             isCompleted={checkCompleted(m.contentId)}
        //             previousCompleted={previousLessonCompleted()}
        //             to={`/overview/lesson/${courseId}/${lessonId}/${m.contentId}`}
        //           >
        //             {m.multimediaType === "PDF" && <ReadingIcon />}
        //             {m.multimediaType === "DOCUMENT" && <ReadingIcon />}
        //             {m.multimediaType === "IMAGE" && <Image />}
        //             {m.multimediaType === "VIDEO" && <PlayIcon />}
        //             {m.multimediaType === "ZIP" && <ZipIcon />}
        //             {m.multimediaType === "PDF" && "Reading: " + m.name}
        //             {m.multimediaType === "DOCUMENT" && "Reading: " + m.name } 
        //             {m.multimediaType === "IMAGE" && "Image: " + m.name}
        //             {m.multimediaType === "VIDEO" && "Video: " + m.name }
        //             {m.multimediaType === "ZIP" && "Zip: " + m.name }  
                                    
        //             { checkCompleted(m.contentId) && <CheckIcon /> }
        //           </ContentLink>                
        //         );
        //       })}
        //     </ContentMenu>
        //   </LessonCard>
        //   <LessonCard>
        //     <LessonHeader>Quiz</LessonHeader>
        //     <QuizWrapper>
        //       {getQuizAttempts()?.map(q => {
        //         return (
        //           <>
        //             <QuizRow>
        //               <QuizSubheader>TIME LIMIT:</QuizSubheader>
        //               <QuizDescription>{q.timeLimit} H</QuizDescription>
        //               <BtnWrapper>
        //                 {!previousLessonCompleted() &&
        //                   <Button disabled>
        //                     Start
        //                 </Button>
        //                 }
        //                 {previousLessonCompleted() && q.studentAttemptCount === 0 &&
        //                   <Button disabled>
        //                     Start
        //                 </Button>
        //                 }
        //                 {previousLessonCompleted() && q.studentAttemptCount > 0 &&
        //                   <Button primary={true} big={false} fontBig={false} disabled={false}
        //                     onClick={() => attemptQuiz(q.contentId)}
        //                   >
        //                     Start
        //                 </Button>
        //                 }
        //               </BtnWrapper>
        //             </QuizRow>
        //             <QuizRow>
        //               <QuizSubheader>No. Attempts Left:</QuizSubheader>
        //               <QuizDescriptionTwo>
        //                 {q.studentAttemptCount}
        //               </QuizDescriptionTwo>
        //               {/*
        //               <QuizSubheader>Grade:</QuizSubheader>
        //               <QuizDescriptionTwo>[To Finish]</QuizDescriptionTwo>
        //               */}
        //             </QuizRow>
        //             <QuizRow style={{ borderBottom: "none" }}>
        //               <BtnWrapper>
        //                 <ViewQuizAttemptsModal isButtonDisabled={!previousLessonCompleted()} studentAttempts={q.studentAttempts}/>
        //               </BtnWrapper>
        //             </QuizRow>
        //           </>
        //         );
        //       })}
        //     </QuizWrapper>
        //   </LessonCard>


        //   <div style={{ display: "flex", flexDirection: "row" }}>

        //     {/* Conditionally render prev button */}
        //     { currentLesson && currentLesson.sequence !== 1 &&
        //       <PrevBtnWrapper>
        //         <Link
        //             type="button"
        //             color="primary"
        //             href={`/overview/lesson/${courseId}/${getLessonIdToNavigateTo(currentLesson.sequence - 1)}`}
        //         >
        //           <ArrowBackward/> Previous Lesson
        //         </Link>
        //       </PrevBtnWrapper>
        //     }

        //     {/* Conditionally render next button */}
        //     { currentLesson && currentLesson.sequence !== enrolledCourse?.enrolledLessons.length &&
        //       <NextBtnWrapper lessonCompleted={lessonCompleted}>
        //         <Link
        //             type="button"
        //             color="primary"
        //             href={`/overview/lesson/${courseId}/${getLessonIdToNavigateTo(currentLesson.sequence + 1)}`}
        //         >
        //           Next Lesson <ArrowForward />
        //         </Link>
        //       </NextBtnWrapper>
        //     }
        //   </div>


        //   </LessonContainer>
        }
    </>
  );
}

const LessonViewerWithRouter = withRouter(LessonViewer);
export default LessonViewerWithRouter;
