import React, { useEffect, useState } from "react";
import {
  getEnrolledCourseByStudentIdAndCourseId,
  setCourseRatingByEnrolledCourseId
} from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Course } from "../../../apis/Entities/Course";
import { Account } from "../../../apis/Entities/Account";

import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';


import {
  StudentContainer,
  PageHeading,
  CourseTitle,
  TutorTitle,
  StudentViewCard,
  CardTitle,
  TutorDetails,
  TutorDepartment,
  TutorName,
  ProfileAvatar,
  TutorText,
  RatingCard,
  RatingTitle,
  TagWrapper,
  TagChip,
  RatingDescription,
  CourseRatingWrapper
} from "./StudentViewElements";

function StudentView(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [myAccount, setMyAccount] = useState<Account>({...props.account});
  const [rating, setRating] = useState<number | null>(1);

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    setCourse(props.course);
  }, [props.course]);

  useEffect(() => {
    setMyAccount(props.account)
}, [props.account])


  useEffect(() => {
    getEnrolledCourseByStudentIdAndCourseId(
      accountId,
      currentCourse.courseId
    ).then(receivedEnrolledCourse => {
      setEnrolledCourse(receivedEnrolledCourse);
    });
  }, []);

  const displayPictureURL = () => {
    return myAccount?.displayPictureUrl ? myAccount?.displayPictureUrl : "";
  }

  const handleRatingChange = (newRating: any) => {
    setRating(newRating);
    if (enrolledCourse) {
      setCourseRatingByEnrolledCourseId(enrolledCourse?.enrolledCourseId , newRating);
    }
  };

  return (
    <StudentContainer>
      <PageHeading>
        <CourseTitle>{currentCourse?.name}</CourseTitle>
        <TutorTitle>by {currentCourse?.tutor.name}</TutorTitle>
      </PageHeading>
      <div className="stepper">
      </div>

      <CardTitle>This course is taught by:</CardTitle>
      <TutorDetails>
        <ProfileAvatar 
        alt={myAccount?.name}
        src={displayPictureURL()}
        style={{ height: "128px", width: "128px" }}
        />
        <TutorText>
          <TutorName>{currentCourse?.tutor.name}</TutorName>
          <TutorDepartment>{currentCourse?.tutor.email}</TutorDepartment>
        </TutorText>
      </TutorDetails>
      <RatingCard>
        <RatingTitle>Passing Requirement</RatingTitle>
        <RatingDescription>You need to pass all graded quizzes to complete this course</RatingDescription>
        <RatingTitle>Course Rating</RatingTitle>
        <Rating name="read-only" value={currentCourse.courseRating} readOnly />
        <RatingTitle>Categories</RatingTitle>
        <TagWrapper>
        {currentCourse?.courseTags.map(tag => (
          <TagChip label={tag.title} color='primary' variant='outlined'/>
        ))}
        </TagWrapper>
        <RatingTitle>Rate this course</RatingTitle>
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={(event, newRating) => handleRatingChange(newRating)}
        />
      </RatingCard>

      
    </StudentContainer>
  );
}

export default StudentView;
