import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  LessonAvatar,
  CourseElement,
  Subject,
  EmptyStateContainer,
  SubjectContainer
} from "../ProgressElements";
import { Button } from "../../../values/ButtonElements";

import { Divider, Grid, Typography } from "@material-ui/core";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Account } from "../../../apis/Entities/Account";
import { Lesson } from "../../../apis/Entities/Lesson";
import LockIcon from "@material-ui/icons/Lock";
import MultimediaModal from "./MultimediaModal";
import { useHistory } from "react-router";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing(2)
  }
}));

function CourseList(props: any) {
  const [myCourses, setMyCourses] = useState<EnrolledCourse[]>([]);
  const [myAccount, setMyAccount] = useState<Account>();
  const [showMultimedia, setShowMultimedia] = useState<Boolean>(false);
  const history = useHistory();

  useEffect(() => {
    setMyAccount(props.account);
    setMyCourses(props.courses);
  }, [props]);

  const displayBannerUrl = (course: EnrolledCourse) => {
    if (course.parentCourse.bannerUrl !== null) {
      console.log(course.parentCourse.bannerUrl);
      return course.parentCourse.bannerUrl;
    } else {
      return "/chessplaceholder.png";
    }
  };

  const navigateToBrowseCoursePage = () => {
    history.push("/browsecourse");
  };
    const getCourseLessons = (course: EnrolledCourse) => {
        console.log(course.enrolledLessons)
        var unlockedSequence = 1; // minimum unlocked lesson is sequence 1
        course.enrolledLessons.map(lesson => {
            if(lesson.dateTimeOfCompletion !== null){
                unlockedSequence++;
            }
        })
        return (
            <div>
                {course.enrolledLessons.map(function (lesson, lessonId) {
                    return (
                        <>
                            <CourseElement key={lessonId}>
                                <LessonAvatar src="/chessplaceholder.png"
                                    alt={course.parentCourse.name} />
                                    <SubjectContainer>
                                    <Subject>{lesson?.parentLesson.name}</Subject>

                                    </SubjectContainer>
                                <MultimediaModal show={showMultimedia} account={myAccount} lesson={lesson.parentLesson} />
                                <div style={{width:"100px"}}>
                                {
                                    course.dateTimeOfCompletion === null ? (lesson.dateTimeOfCompletion !== null || lesson.parentLesson.sequence === unlockedSequence ? <Button variant="outlined" primary={true} to={`/overview/lesson/${course.parentCourse.courseId}/${lesson.parentLesson.lessonId}`}>Resume</Button> :
                                    <Button variant="outlined" primary={false} disabled><LockIcon/></Button>) : <Button primary={true} to={`/overview/lesson/${course.parentCourse.courseId}/${lesson.parentLesson.lessonId}`}>View</Button>
                                }
                                </div>
                            </CourseElement>
                        </>
                    );
                })}
            </div>
        )
    }

  const getCourseLessons = (course: EnrolledCourse) => {
    console.log(course.enrolledLessons);
    return (
      <div>
        {course.enrolledLessons.map(function(lesson, lessonId) {
          return (
            <>
              <CourseElement key={lessonId}>
                <LessonAvatar
                  src="/chessplaceholder.png"
                  alt={course.parentCourse.name}
                />
                <SubjectContainer>
                  <Subject>{lesson?.parentLesson.name}</Subject>
                </SubjectContainer>
                <MultimediaModal
                  show={showMultimedia}
                  account={myAccount}
                  lesson={lesson.parentLesson}
                />
                <div style={{ width: "100px" }}>
                  {course.dateTimeOfCompletion === null ? (
                    lesson.dateTimeOfCompletion !== null ||
                    lesson.parentLesson.sequence === 1 ? (
                      <Button
                        variant="outlined"
                        primary={true}
                        to={`/overview/lesson/${course.parentCourse.courseId}/${lesson.parentLesson.lessonId}`}
                      >
                        Resume
                      </Button>
                    ) : (
                      <Button variant="outlined" primary={false} disabled>
                        <LockIcon />
                      </Button>
                    )
                  ) : (
                    <Button
                      primary={true}
                      to={`/overview/lesson/${course.parentCourse.courseId}/${lesson.parentLesson.lessonId}`}
                    >
                      View
                    </Button>
                  )}
                </div>
              </CourseElement>
            </>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {myCourses?.length > 0 && (
        <Grid container>
          {myCourses.map((course, courseId) => (
            <Grid item xs={5} key={courseId} style={{ margin: "5px" }}>
              <h4>{course.parentCourse.name}</h4>
              <Divider />
              {getCourseLessons(course)}
            </Grid>
          ))}
        </Grid>
      )}
      {myCourses?.length === 0 && (
        <EmptyStateContainer>
          <Typography>No courses here! 😢</Typography>
          <br />
          <Button
            onClick={navigateToBrowseCoursePage}
            style={{ width: "10%" }}
            big
          >
            Browse Courses
          </Button>
        </EmptyStateContainer>
      )}
    </>
  );
}

export default CourseList;
