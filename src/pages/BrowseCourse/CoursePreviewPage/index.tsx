import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { Course } from "../../../apis/Entities/Course";
import { Account } from "../../../apis/Entities/Account";
import {
  PreviewContainer,
  EnrollCard,
  EnrollImage,
  EnrollBtn,
  CourseTags,
  TagChip,
  CourseHeader,
  CourseProviderName,
  CourseDescription,
  CoursePrice,
  SyllabusCard,
  SyllabusTable,
  SyllabusTableData,
  SyllabusTableHeader
} from "./CoursePreviewElements";
import { Button } from "../../../values/ButtonElements";
import { getMyAccount } from "../../../apis/Account/AccountApis";
import { createStripeSession } from "../../../apis/Stripe/StripeApis";
import { StripePaymentReq } from "../../../apis/Entities/Stripe"

function CoursePreviewPage(props: any) {
  const courseId = props.match.params.courseId;
  const [currentUser, setUser] = useState<Account>();
  const [currentCourse, setCourse] = useState<Course>();
  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    getCourseByCourseId(courseId).then(receivedCourse => {
      setCourse(receivedCourse);
      console.log(receivedCourse.name);
    });
  }, []);

  useEffect(() => {
    getMyAccount(accountId).then(receivedAccount => {
      setUser(receivedAccount);
    });
  }, []);

  const invokeStripeSessionCreation = () => {
    if (currentCourse !== undefined && currentUser !== undefined) {
      const stripePaymentReq: StripePaymentReq = {
        studentId: currentUser.accountId,
        tutorId: currentCourse.tutor.accountId,
        courseId: currentCourse.courseId,
        tutorName: currentCourse.tutor.name,
        amount: currentCourse.price,
        tutorStripeAccountId: currentCourse.tutor.stripeAccountId
      }

      createStripeSession(stripePaymentReq).then((paymentUrl: string) => {
        let newTab = window.open(paymentUrl, '_blank');
        newTab?.focus();
      })
    }
  }

  /** HELPER METHODS */
  function courseIsNotEnrolled(course: Course): boolean {
    let userEnrolledCourses = currentUser?.enrolledCourses;
    var userParentCourses = userEnrolledCourses?.map(function(c) {
      return c.parentCourse.courseId;
    });
    if (userParentCourses?.includes(course.courseId)) {
      return true;
    }
    return false;
  }

   //if current user is this course's tutor this function, returns true
  function isCourseTutor(course: Course): boolean {
        
    if(course.tutor.accountId == currentUser?.accountId) {
      return true;
    }
      return false;
  }

  return (
    <PreviewContainer>
      <EnrollCard>
        <EnrollImage src="/chessplaceholder.png" />
        <EnrollBtn>
          {currentCourse && currentCourse.isEnrollmentActive && !courseIsNotEnrolled(currentCourse) && !isCourseTutor(currentCourse) &&
            <Button primary onClick={invokeStripeSessionCreation}> Enroll </Button>
          }
          {currentCourse && !currentCourse.isEnrollmentActive && !courseIsNotEnrolled(currentCourse) &&
            <Button disabled> This course is currently not taking in any new enrollment</Button>
          }
          {currentCourse && courseIsNotEnrolled(currentCourse) && (
            <Button disabled>
              Enrolled
            </Button>
          )}
          {currentCourse && isCourseTutor(currentCourse) && (
            <Button primary to={`/overview/${currentCourse.courseId}`}>
              Go to overview
            </Button>
          )}
        </EnrollBtn>
      </EnrollCard>
      <CourseTags>
        {currentCourse?.courseTags.map(tag => (
          <TagChip label={tag.title} />
        ))}
      </CourseTags>
      <CourseHeader>{currentCourse?.name}</CourseHeader>
      <CourseProviderName>{currentCourse?.tutor.name}</CourseProviderName>
      <CourseHeader>Description</CourseHeader>
      <CourseDescription>{currentCourse?.description}</CourseDescription>
      <CourseHeader>Syllabus and Schedule</CourseHeader>
      <SyllabusCard>
        {currentCourse && currentCourse?.lessons.length == 0 &&
        <CourseDescription>There are no lessons under this course yet 😅</CourseDescription>
        }
        {currentCourse && currentCourse?.lessons.length > 0 &&
        <SyllabusTable>
        <tr>
            <SyllabusTableHeader>Number</SyllabusTableHeader>
            <SyllabusTableHeader>Lesson</SyllabusTableHeader>
            <SyllabusTableHeader>Description</SyllabusTableHeader>
        </tr>
        {currentCourse?.lessons?.map(lesson => {
            return (
            <>
            <tr>
                <SyllabusTableData>{lesson.sequence}</SyllabusTableData>
                <SyllabusTableData>{lesson.name}</SyllabusTableData>
                <SyllabusTableData>{lesson.description}</SyllabusTableData>
            </tr>
            </>
            );
          })}
        </SyllabusTable>
        }
    </SyllabusCard>
      <CourseHeader>Price</CourseHeader>
      <CoursePrice>SGD {currentCourse?.price}</CoursePrice>
    </PreviewContainer>
  );
}

const CoursePreviewPageWithRouter = withRouter(CoursePreviewPage);
export default CoursePreviewPageWithRouter;
