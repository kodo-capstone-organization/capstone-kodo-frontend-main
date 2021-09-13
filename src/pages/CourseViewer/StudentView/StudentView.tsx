import React, { useEffect, useState } from "react";
import {
  getEnrolledCourseByStudentIdAndCourseId,
  setCourseRatingByEnrolledCourseId
} from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Course } from "../../../apis/Entities/Course";
import { Account } from "../../../apis/Entities/Account";
import clsx from 'clsx';
import { makeStyles, createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepButton, Typography, StepLabel, Link, StepConnector, Box } from "@material-ui/core";
import { Lesson } from '../../../apis/Entities/Lesson';
import { EnrolledLesson } from '../../../apis/Entities/EnrolledLesson';
import { Button } from '../../../values/ButtonElements';
import Rating from '@material-ui/lab/Rating';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LockIcon from '@material-ui/icons/Lock';
import { StepIconProps } from '@material-ui/core/StepIcon';
import {
  StudentContainer,
  PageHeading,
  CourseTitle,
  TutorTitle,
  StudentViewCard,
  StudentViewCardHeader,
  StudentViewCardContent,
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
  StepperIcon
} from "./StudentViewElements";
import { LessonDescription, CheckIcon } from "../LessonViewer/LessonViewerElements";
import { useHistory } from "react-router";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { createNewAccount } from "../../../apis/Account/AccountApis";


function StudentView(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>({...props.enrolledCourse});
  const [myAccount, setMyAccount] = useState<Account>({ ...props.account });
  const [rating, setRating] = useState<number | undefined>(enrolledCourse.courseRating == 0 ? 1 : enrolledCourse.courseRating);
  const [activeStep, setActiveStep] = React.useState<number>();
  const [latestLesson, setLatestLesson] = React.useState<EnrolledLesson>();
  const [steps, setSteps] = React.useState<EnrolledLesson[]>([])
  const history = useHistory();

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    setCourse(props.course);
    setMyAccount(props.account);     
    setEnrolledCourse(props.enrolledCourse);
    initialiseActiveStep(enrolledCourse);
    // const test = receivedEnrolledCourse.enrolledLessons.concat(receivedEnrolledCourse.enrolledLessons).concat(receivedEnrolledCourse.enrolledLessons).concat(receivedEnrolledCourse.enrolledLessons)
    //@ts-ignore
    setSteps(enrolledCourse.enrolledLessons);
    console.log(enrolledCourse.enrolledLessons)
    // setSteps(test);
    }, [props.course]);

    console.log(enrolledCourse)

  const initialiseActiveStep = (receivedEnrolledCourse: EnrolledCourse) => {
    var proxyActiveStep = 0 // to set stepper
    var latestLessonCounter = 0 // to redirect in course overview section
    receivedEnrolledCourse.enrolledLessons.map((x, index) => {
      if (x.dateTimeOfCompletion !== null) { // if lesson has been completed, next lesson is active & set new latest Lesson
        proxyActiveStep++;
        setActiveStep(proxyActiveStep);
        setLatestLesson(x);
      } else if (x.dateTimeOfCompletion === null && latestLessonCounter === 0) { // set first uncompleted lesson as latest lesson
        setLatestLesson(x);
        latestLessonCounter++;
        if (x.parentLesson.sequence === 1) { // if lesson one has not been completed, lesson 1 at index 0 is active
          proxyActiveStep++;
          setActiveStep(0);
        }
      }
    })
    console.log(proxyActiveStep)
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

  const handleRatingChange = (newRating: any) => {
    setRating(newRating);
    setCourseRatingByEnrolledCourseId(enrolledCourse.enrolledCourseId, newRating);
  };

  const displayPictureURL = () => {
    return myAccount?.displayPictureUrl ? myAccount?.displayPictureUrl : "";
  }

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
    history.push(`/overview/lesson/${currentCourse?.courseId}/${latestLesson?.parentLesson.lessonId}`)
  }

  const classes = useStyles();
  
  return (
    <StudentContainer>
      <PageHeading>
        <CourseTitle>{currentCourse?.name}</CourseTitle>
        <TutorTitle>by {currentCourse?.tutor.name}</TutorTitle>
      </PageHeading>

      <div className={classes.root}>
        <Box component="div" my={2} overflow="auto" bgcolor="background.paper">
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((enrolledLesson) => (
              <Step key={enrolledLesson.parentLesson.lessonId}>
                
                <StepLabel StepIconComponent={StepIcon}>
                  <Link color="primary" href={`/overview/lesson/${currentCourse.courseId}/${enrolledLesson.parentLesson.lessonId}`}>
                    Week {enrolledLesson.parentLesson.sequence}
                  </Link>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </div>

      <StudentViewCard>
        <StudentViewCardHeader title="Course Overview" />
        <StudentViewCardContent>
          <RatingTitle>{currentCourse.description}</RatingTitle>
          <Button primary style={{ marginLeft: "auto" }} onClick={navigateToLatestLesson}>Continue Course</Button>
        </StudentViewCardContent>

      </StudentViewCard>


      <CardTitle>This course is taught by:</CardTitle>
      <TutorDetails>
        <ProfileAvatar
          alt={myAccount?.name}
          src={displayPictureURL()}
          style={{ height: "128px", width: "128px" }}
        />
        <TutorText>
          <TutorName>{currentCourse?.tutor.name}</TutorName>
          <TutorName><i>@{currentCourse?.tutor.username}</i></TutorName>
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
            <TagChip label={tag.title} color='primary' variant='outlined' />
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
