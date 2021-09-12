import React, { useEffect, useState } from "react";
import {
  getEnrolledCourseByStudentIdAndCourseId,
  setCourseRatingByEnrolledCourseId
} from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Course } from "../../../apis/Entities/Course";
import { Account } from "../../../apis/Entities/Account";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Stepper, Step, StepButton, Button, Typography } from "@material-ui/core";
import { Lesson } from '../../../apis/Entities/Lesson';
import { EnrolledLesson } from '../../../apis/Entities/EnrolledLesson';
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

const getSteps = () => {
  return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
}

const getStepContent = (step: number) => {
  switch (step) {
    case 0:
      return 'Step 1: Select campaign settings...';
    case 1:
      return 'Step 2: What is an ad group anyways?';
    case 2:
      return 'Step 3: This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
}

function StudentView(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [myAccount, setMyAccount] = useState<Account>({ ...props.account });
  const [rating, setRating] = useState<number | null>(1);
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set<number>());
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [lessons, setLessons] = React.useState<(EnrolledLesson)[]>([]);
  const steps = getSteps();

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    setCourse(props.course);
  }, [props.course]);

  useEffect(() => {
    setMyAccount(props.account)
  }, [props.account])


  const totalSteps = () => {
    return getSteps().length;
  };

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const skippedSteps = () => {
    return skipped.size;
  };

  const completedSteps = () => {
    return completed.size;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps() - skippedSteps();
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed
        // find the first step that has been completed
        steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1;

    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);

    /**
     * Sigh... it would be much nicer to replace the following if conditional with
     * `if (!this.allStepsComplete())` however state is not set when we do this,
     * thus we have to resort to not being very DRY.
     */
    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext();
    }
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  function isStepComplete(step: number) {
    return completed.has(step);
  }


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
      setCourseRatingByEnrolledCourseId(enrolledCourse?.enrolledCourseId, newRating);
    }
  };

  return (
    <StudentContainer>
      <PageHeading>
        <CourseTitle>{currentCourse?.name}</CourseTitle>
        <TutorTitle>by {currentCourse?.tutor.name}</TutorTitle>
      </PageHeading>
      <div className={classes.root}>
        <Stepper alternativeLabel nonLinear activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const buttonProps: { optional?: React.ReactNode } = {};
            if (isStepOptional(index)) {
              buttonProps.optional = <Typography variant="caption">Optional</Typography>;
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepButton
                  onClick={handleStep(index)}
                  completed={isStepComplete(index)}
                  {...buttonProps}
                >
                  {label}
                </StepButton>
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
