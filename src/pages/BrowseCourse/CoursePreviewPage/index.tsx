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

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import DoneIcon from "@material-ui/icons/Done";

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

  return (
    <PreviewContainer>
      <EnrollCard>
        <EnrollImage src="/chessplaceholder.png" />
        <EnrollBtn>
          {currentCourse && !courseIsNotEnrolled(currentCourse) && (
            <Button primary={true} big={false} fontBig={false} disabled={false}>
              Enroll
            </Button>
          )}
          {currentCourse && courseIsNotEnrolled(currentCourse) && (
            <Button primary={false} big={false} fontBig={false} disabled={true}>
              Enrolled
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
    </SyllabusCard>
      <CourseHeader>Price</CourseHeader>
      <CoursePrice>SGD {currentCourse?.price}</CoursePrice>
    </PreviewContainer>
  );
}

const CoursePreviewPageWithRouter = withRouter(CoursePreviewPage);
export default CoursePreviewPageWithRouter;
