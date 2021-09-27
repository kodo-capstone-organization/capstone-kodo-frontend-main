import React, { useState, useEffect } from "react";
import {
  LessonAvatar,
  CourseElement,
  Subject,
  EmptyStateContainer,
  SubjectContainer,
} from "../ProgressElements";
import { Button } from "../../../values/ButtonElements";
import { Divider, Grid, Typography } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { EnrolledLesson } from "../../../apis/Entities/EnrolledLesson";
import { Account } from "../../../apis/Entities/Account";
import LockIcon from "@material-ui/icons/Lock";
import MultimediaModal from "./MultimediaModal";
import { useHistory } from "react-router";

function CourseList(props: any) {
  const [myCourses, setMyCourses] = useState<EnrolledCourse[]>([]);
  const [myAccount, setMyAccount] = useState<Account>();
  const [showMultimedia, setShowMultimedia] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    setMyAccount(props.account);
    setMyCourses(props.courses);
    setLoading(false);
  }, [props]);

  const displayBannerUrl = (course: EnrolledCourse) => {
    if (course.parentCourse.bannerUrl !== null) {
      return course.parentCourse.bannerUrl;
    } else {
      return "/chessplaceholder.png";
    }
  };

  const navigateToBrowseCoursePage = () => {
    history.push("/browsecourse");
  };

  const getLatestLessonToResume = (enrolledLessons: EnrolledLesson[]) => {
    var lessonIndex = 1;
    enrolledLessons.map(lesson => {
      if (lesson.dateTimeOfCompletion !== null) {
        lessonIndex++;
      }
    })
    return lessonIndex
  }

  const getCourseLessons = (course: EnrolledCourse) => {
    return (
      <div>
        {course.enrolledLessons.map(function (lesson, lessonId) {
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
                      lessonId < getLatestLessonToResume(course.enrolledLessons) ? (
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

  function coursesExist() {
    return myCourses?.length > 0;
  }

  if (loading) return (
    <EmptyStateContainer><CircularProgress /></EmptyStateContainer>
  );

  if (myAccount && myCourses && !coursesExist()) return (
    <EmptyStateContainer coursesExist={coursesExist()}>
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
  );

  return (
    <>
      <Grid container>
        {myCourses.map((course, courseId) => (
          <Grid item xs={5} key={courseId} style={{ margin: "5px" }}>
            <h4>{course.parentCourse.name}</h4>
            <Divider />
            {getCourseLessons(course)}
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default CourseList;
