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
} from "./StudentViewElements";
import { LessonDescription, CheckIcon } from "../LessonViewer/LessonViewerElements";
import { useHistory } from "react-router";


function StudentView(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [myAccount, setMyAccount] = useState<Account>({ ...props.account });
  const [rating, setRating] = useState<number | null>(1);
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

    getEnrolledCourseByStudentIdAndCourseId(
      accountId,
      currentCourse.courseId
    ).then(receivedEnrolledCourse => {
      setEnrolledCourse(receivedEnrolledCourse);
      initialiseActiveStep(receivedEnrolledCourse);
      // const test = receivedEnrolledCourse.enrolledLessons.concat(receivedEnrolledCourse.enrolledLessons).concat(receivedEnrolledCourse.enrolledLessons).concat(receivedEnrolledCourse.enrolledLessons)
      //@ts-ignore
      setSteps(receivedEnrolledCourse.enrolledLessons);
      // setSteps(test);
    });
  }, [props.course]);

  const initialiseActiveStep = (receivedEnrolledCourse : EnrolledCourse) => {
    var proxyActiveStep = -1 // to set stepper
    var latestLessonCounter = 0 // to redirect in course overview section
    receivedEnrolledCourse.enrolledLessons.map(x => {
      if (x.dateTimeOfCompletion !== null) { // if lesson has been completed, increase activeStep
        proxyActiveStep++;
        setActiveStep(proxyActiveStep);
        setLatestLesson(x);
      } else if (x.dateTimeOfCompletion === null && latestLessonCounter === 0) { // if lesson has not been completed for the first time, set latestLesson
        setLatestLesson(x);
        latestLessonCounter++;
        if (x.parentLesson.sequence === 1) { // if latestLesson is lesson 1
          proxyActiveStep++;
          setActiveStep(proxyActiveStep);
        }
      }
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

  const handleRatingChange = (newRating: any) => {
    setRating(newRating);
    if (enrolledCourse) {
      setCourseRatingByEnrolledCourseId(enrolledCourse?.enrolledCourseId, newRating);
    }
  };

  const displayPictureURL = () => {
    return myAccount?.displayPictureUrl ? myAccount?.displayPictureUrl : "";
  }

  const StepIconStyles = makeStyles({
    root: {
      color: '#eaeaf0',
      display: 'flex',
      height: 22,
      alignItems: 'center',
    },
    active: {
      color: '#784af4',
    },
    circle: {
      color: 'grey',
      zIndex: 1,
      fontSize: 18,
    },
    completed: {
      color: 'green',
      zIndex: 1,
      fontSize: 18,
    },
  });
  const StepIcon = (props: StepIconProps) => {
    const classes = StepIconStyles();
    const { active, completed } = props;
    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
        })}
      >
        {
        active ? <CheckCircleIcon className={classes.completed} /> : <LockIcon className={classes.circle} />
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
                  <Link color="inherit" href={`/overview/lesson/${currentCourse.courseId}/${enrolledLesson.parentLesson.lessonId}`}>
                    {enrolledLesson.parentLesson.name}
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
