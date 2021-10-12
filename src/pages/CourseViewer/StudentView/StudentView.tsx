import React, { useEffect, useState } from "react";

import { useHistory } from "react-router";

import clsx from 'clsx';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Rating from '@material-ui/lab/Rating';
import { StepIconProps } from '@material-ui/core/StepIcon';
import { 
  Theme, 
  createStyles, 
  makeStyles, 
} from '@material-ui/core/styles';
import { 
  Box, 
  Link, 
  Step, 
  StepLabel, 
  Stepper, 
} from "@material-ui/core";

import {
  CardTitle,
  CourseTitle,
  PageHeading,
  RatingCard,
  RatingDescription,
  RatingTitle,
  StudentContainer,
  StudentViewCard,
  StudentViewCardContent,
  StudentViewCardHeader,
  TagChip,
  TagWrapper,
  TutorDepartment,
  TutorDetails,
  TutorName,
  TutorText,
  TutorTitle,
} from "./StudentViewElements";

import { Account } from "../../../apis/Entities/Account";
import { Course } from "../../../apis/Entities/Course";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { EnrolledLesson } from '../../../apis/Entities/EnrolledLesson';

import { setCourseRatingByEnrolledCourseId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { getEnrolledCourseByStudentIdAndCourseId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { getCourseRatingByCourseId } from "../../../apis/Course/CourseApis";

import KodoAvatar from "../../../components/KodoAvatar/KodoAvatar";

import { Button } from '../../../values/ButtonElements';

function StudentView(props: any) {
  const [course, setCourse] = useState<Course>();
  const [account, setAccount] = useState<Account>();

  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [steps, setSteps] = useState<EnrolledLesson[]>([]);
  const [latestLesson, setLatestLesson] = useState<EnrolledLesson>();
  const [courseRating, setCourseRating] = useState<number>(0);
  const [studentRating, setStudentRating] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);  
  
  const [loading, setLoading] = useState<Boolean>(true);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    setCourse(props.course);
    setAccount(props.account);
    getEnrolledCourseByStudentIdAndCourseId(props.account.accountId, props.course.courseId)
    .then((enrolledCourse: EnrolledCourse) => {
      setEnrolledCourse(enrolledCourse);
      setStudentRating(enrolledCourse.courseRating)
      setSteps(enrolledCourse.enrolledLessons);
      initialiseActiveStep(enrolledCourse);
    })
    .catch((err: any) => {
      console.log(err);
    });
    getCourseRatingByCourseId(props.course.courseId)
    .then((courseRating: number) => {
      setCourseRating(courseRating);
    })
    .catch((err: any) => {
      console.log(err);
    });    
    setLoading(false);
  }, [props.course, props.account]);

  const initialiseActiveStep = (receivedEnrolledCourse: EnrolledCourse) => {
    var proxyActiveStep = 0 // to set stepper
    var latestLessonCounter = 0 // to redirect in course overview section
    receivedEnrolledCourse.enrolledLessons.map((enrolledLesson, index) => {
      if (enrolledLesson.dateTimeOfCompletion !== null) { // if lesson has been completed, next lesson is active & set new latest Lesson
        proxyActiveStep++;
        setActiveStep(proxyActiveStep);
        setLatestLesson(enrolledLesson);
      } else if (enrolledLesson.dateTimeOfCompletion === null && latestLessonCounter === 0) { // set first uncompleted lesson as latest lesson
        setLatestLesson(enrolledLesson);
        latestLessonCounter++;
        if (enrolledLesson.parentLesson.sequence === 1) { // if lesson one has not been completed, lesson 1 at index 0 is active
          proxyActiveStep++;
          setActiveStep(0);
        }
      }
      return enrolledLesson;
    })
  }


  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        // width: '100%',
        width: '900px',
      },
      button: {
        marginRight: theme.spacing(1),
      },
      backButton: {
        marginRight: theme.spacing(1),
      },
      completed: {
        display: 'inline-block',
      },
      instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      }
    }),
  );

  const handleRatingChange = (newStudentRating: any) => {
    setStudentRating(newStudentRating);
    if (enrolledCourse)
    {
      setCourseRatingByEnrolledCourseId(enrolledCourse.enrolledCourseId, newStudentRating);
    }
  };

  const StepIconStyles = makeStyles({
    root: {
      color: '#eaeaf0',
      display: 'flex',
      height: 20,
      alignItems: 'center',
    },
    active: {
      color: '#784af4',
    },
    circle: {
      color: 'grey',
      fontSize: 20,
    },
    completed: {
      color: 'green',
      fontSize: 20,
    },
  });
  const StepIcon = (props: StepIconProps) => {
    const classes = StepIconStyles();
    const { active, completed } = props;
    console.log(props)
    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
        })}
      >
        {
          completed ? <CheckCircleIcon className={classes.completed} /> : active ? <LockOpenIcon className={classes.completed} /> : <LockIcon className={classes.circle} />
        }
      </div>
    );
  }

  const navigateToLatestLesson = () => {
    history.push(`/overview/course/${enrolledCourse?.enrolledCourseId}/lesson/${latestLesson?.enrolledLessonId}`)
  }

  const classes = useStyles();

  return (
    <>
      {
        !loading &&    
        <StudentContainer>
          <PageHeading>
            <CourseTitle>{course?.name}</CourseTitle>
            <TutorTitle>by {course?.tutor.name}</TutorTitle>
          </PageHeading>

          <div className={classes.root}>
            <Box component="div" my={2} overflow="auto" bgcolor="background.paper">
              <Stepper alternativeLabel activeStep={activeStep}>
                {steps.map((enrolledLesson: EnrolledLesson) => {
                  return(
                    <Step key={enrolledLesson.parentLesson.lessonId}>                
                      <StepLabel StepIconComponent={StepIcon}>
                        <Link color="primary" href={`/overview/course/${enrolledCourse?.enrolledCourseId}/lesson/${enrolledLesson.enrolledLessonId}`}>
                          Week {enrolledLesson.parentLesson.sequence}
                        </Link>
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </Box>
          </div>

          <StudentViewCard>
            <StudentViewCardHeader title="Course Overview" />
            <StudentViewCardContent>
              <RatingTitle>{course?.description}</RatingTitle>
              <Button primary style={{ marginLeft: "auto" }} onClick={navigateToLatestLesson}>Continue Course</Button>
            </StudentViewCardContent>

          </StudentViewCard>


          <CardTitle>This course is taught by:</CardTitle>
          <TutorDetails>
            <KodoAvatar name={course?.tutor.name} displayPictureURL={course?.tutor.displayPictureUrl || ""}/>
            <TutorText>
              <TutorName>{course?.tutor.name}</TutorName>
              <TutorName><i>@{course?.tutor.username}</i></TutorName>
              <TutorDepartment>{course?.tutor.email}</TutorDepartment>
            </TutorText>
          </TutorDetails>
          <RatingCard>
            <RatingTitle>Passing Requirement</RatingTitle>
            <RatingDescription>You need to pass all graded quizzes to complete this course</RatingDescription>
            <RatingTitle>Course Rating</RatingTitle>
            <Rating name="read-only" value={Math.round(courseRating)} readOnly />
            <RatingTitle>Categories</RatingTitle>
            <TagWrapper>
              {course?.courseTags.map(tag => (
                <TagChip label={tag.title} color='primary' variant='outlined' />
              ))}
            </TagWrapper>
            <RatingTitle>Rate this course</RatingTitle>
            <Rating
              name="simple-controlled"
              value={studentRating}
              onChange={(event, newRating) => handleRatingChange(newRating)}
            />
          </RatingCard>


        </StudentContainer>
      }
    </>
  );
}

export default StudentView;
