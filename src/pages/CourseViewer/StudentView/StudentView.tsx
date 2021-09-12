import React, { useEffect, useState } from "react";
import {
  getEnrolledCourseByStudentIdAndCourseId,
  setCourseRatingByEnrolledCourseId
} from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Course } from "../../../apis/Entities/Course";
import { Account } from "../../../apis/Entities/Account";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Stepper, Step, StepButton, Button, Typography, StepLabel, Link } from "@material-ui/core";
import { Lesson } from '../../../apis/Entities/Lesson';
import { EnrolledLesson } from '../../../apis/Entities/EnrolledLesson';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import CheckIcon from '@material-ui/icons/Check';
import { StepIconProps } from '@material-ui/core/StepIcon';


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
import { LessonDescription } from "../LessonViewer/LessonViewerElements";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
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
    },
  }),
);

// const getSteps = () => {
//   return lessons.map();
// }

// const getStepContent = (step: number) => {
//   switch (step) {
//     case 0:
//       return 'Step 1: Select campaign settings...';
//     case 1:
//       return 'Step 2: What is an ad group anyways?';
//     case 2:
//       return 'Step 3: This is the bit I really care about!';
//     default:
//       return 'Unknown step';
//   }
// }

function StudentView(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [myAccount, setMyAccount] = useState<Account>({ ...props.account });
  const [rating, setRating] = useState<number | null>(1);
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(-1);
  const [completed, setCompleted] = React.useState(new Set<number>());
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [lessons, setLessons] = React.useState<(EnrolledLesson)[]>([]);
  const [steps, setSteps] = React.useState<string[]>([])

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    setCourse(props.course);
  }, [props.course]);

  useEffect(() => {
    setMyAccount(props.account)
    setLessons(props.account.enrolledLessons)
  }, [props.account])

  useEffect(() => {
    getEnrolledCourseByStudentIdAndCourseId(
      accountId,
      currentCourse.courseId
    ).then(receivedEnrolledCourse => {
      setEnrolledCourse(receivedEnrolledCourse);
      console.log(receivedEnrolledCourse)
      var proxyActiveStep = -1
      receivedEnrolledCourse.enrolledLessons.map(x => {
        if (x.dateTimeOfCompletion !== null) {
          console.log("x", x.dateTimeOfCompletion !== null)
          proxyActiveStep++;
          setActiveStep(proxyActiveStep);
        }
      })
      console.log(proxyActiveStep)
      const arrayOfLessonName = receivedEnrolledCourse.enrolledLessons.map(x => x.parentLesson.name);
      //@ts-ignore
      setSteps(arrayOfLessonName);
    });
  }, []);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleStepClick = (e: any) => () => {
    console.log("e", e)
  };


  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  function isStepComplete(step: number) {
    // return false;
    return completed.has(step);
  }

  const displayPictureURL = () => {
    return myAccount?.displayPictureUrl ? myAccount?.displayPictureUrl : "";
  }

  const handleRatingChange = (newRating: any) => {
    setRating(newRating);
    if (enrolledCourse) {
      setCourseRatingByEnrolledCourseId(enrolledCourse?.enrolledCourseId, newRating);
    }
  };

  const stepStyleLibrary = makeStyles({
    root: {
      backgroundColor: '#ccc',
      zIndex: 1,
      color: '#fff',
      width: 50,
      height: 50,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    },
  })

  const StepIconPopulation = (props: StepIconProps) => {
    const classes = stepStyleLibrary();
    const { active, completed } = props;
  
    return (
      <div
        // className={(classes.root, {
        //   [classes.active]: active,
        // })}
      >
        <CheckIcon/>
        {/* {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />} */}
      </div>
    );
  }

  return (
    <StudentContainer>
      <PageHeading>
        <CourseTitle>{currentCourse?.name}</CourseTitle>
        <TutorTitle>by {currentCourse?.tutor.name}</TutorTitle>
      </PageHeading>

      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps} StepIconComponent={StepIconPopulation}>
                  <Link onClick={handleStepClick}>
                    {label}
                  </Link>
                </StepLabel>
              </Step>

            );
          })}
        </Stepper>
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
        <CourseRatingWrapper>⭐ ⭐ ⭐</CourseRatingWrapper>
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
