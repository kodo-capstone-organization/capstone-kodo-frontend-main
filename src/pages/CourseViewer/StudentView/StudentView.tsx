import { useEffect, useState } from "react";

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
import { getEnrolledCourseByCourseIdAndAccountId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { getCourseRatingByCourseId } from "../../../apis/Course/CourseApis";
import { getAccountByCourseId } from "../../../apis/Account/AccountApis";

import KodoAvatar from "../../../components/KodoAvatar/KodoAvatar";

import { Button } from '../../../values/ButtonElements';

function StudentView(props: any) {
 
  const courseId = props.courseId;

  const [course, setCourse] = useState<Course>();

  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();
  const [steps, setSteps] = useState<EnrolledLesson[]>([]);
  const [latestLesson, setLatestLesson] = useState<EnrolledLesson>();
  const [courseRating, setCourseRating] = useState<number>(0);
  const [studentRating, setStudentRating] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);  
  const [tutor, setTutor] = useState<Account>();

  const [loading, setLoading] = useState<Boolean>(true);

  const history = useHistory();

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    setLoading(true);    
    getEnrolledCourseByCourseIdAndAccountId(courseId, accountId)
    .then((enrolledCourse: EnrolledCourse) => {
      setEnrolledCourse(enrolledCourse);
      setCourse(enrolledCourse.parentCourse);
      props.setCourse(enrolledCourse.parentCourse);
      setStudentRating(enrolledCourse.courseRating)
      setSteps(enrolledCourse.enrolledLessons);
      initialiseActiveStep(enrolledCourse);
    })
    .catch((err) => handleError(err));    
    getAccountByCourseId(courseId)
    .then((account: Account) => {
      setTutor(account)
    })
    getCourseRatingByCourseId(courseId)
    .then((courseRating: number) => {
      setCourseRating(courseRating);
    })
    .catch((err: any) => {
      console.log(err);
    });    
    setLoading(false);
  }, [courseId, accountId]);

  function handleError(err: any): void {
    if (err.response.data !== undefined)
    {
      const errorDataObj = createErrorDataObj(err);
      props.callOpenSnackBar("Error in retrieving course", "error");
      history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj }})
    }
  }

  function createErrorDataObj(err: any): any {
    const errorDataObj = { 
        message1: 'Unable to view course',
        message2: err.response.data.message,
        errorStatus: err.response.status,
        returnPath: '/browsecourse',
        returnText: 'Browse Courses'
    }

    return errorDataObj;
  }

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
            <TutorTitle>by {tutor?.name}</TutorTitle>
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
          { tutor &&
          <TutorDetails>
            <KodoAvatar name={tutor.name} displayPictureURL={tutor.displayPictureUrl || ""}/>
            <TutorText>
              <TutorName>{tutor.name}</TutorName>
              <TutorName><i>@{tutor.username}</i></TutorName>
              <TutorDepartment>{tutor.email}</TutorDepartment>
            </TutorText>
          </TutorDetails>
          }
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
