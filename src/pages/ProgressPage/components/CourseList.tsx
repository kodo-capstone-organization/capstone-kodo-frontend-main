import { useState, useEffect } from "react";

import { useHistory } from "react-router";

import LockIcon from "@material-ui/icons/Lock";
import CircularProgress from '@material-ui/core/CircularProgress';
import { 
  Divider, 
  Grid, 
  Typography 
} from "@material-ui/core";

import { EnrolledCourse } from "../../../Entities/EnrolledCourse";
import { EnrolledLesson } from "../../../Entities/EnrolledLesson";
import { Account } from "../../../Entities/Account";

import MultimediaModal from "./MultimediaModal";
import {
  CourseElement,
  EmptyStateContainer,
  LessonAvatar,
  Subject,
  SubjectContainer,
} from "../ProgressElements";

import { Button } from "../../../values/ButtonElements";

function CourseList(props: any) {
  const [myCourses, setMyCourses] = useState<EnrolledCourse[]>([]);
  const [myAccount, setMyAccount] = useState<Account>();
  const [showMultimedia, setShowMultimedia] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(true);
  const [curTabIdx, setCurTabIdx] = useState<number>(0);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    setMyAccount(props.account);
    setMyCourses(props.courses);
    setLoading(false);
    setCurTabIdx(props.curTabIdx)
  }, [props]);

  const displayBannerUrl = (enrolledCourse: EnrolledCourse) => {
    if (enrolledCourse.parentCourse.bannerUrl.length > 0) {
      return enrolledCourse.parentCourse.bannerUrl;
    } else {
      return "/chessplaceholder.png";
    }
  };

  const navigateToBrowseCoursePage = () => {
    history.push("/browsecourse");
  };

  const getLatestLessonToResume = (enrolledLessons: EnrolledLesson[]) => {
    var enrolledLessonIndex = 1;
    enrolledLessons.map(enrolledLesson => {
      if (enrolledLesson.dateTimeOfCompletion !== null) {
        enrolledLessonIndex++;
      }
      return enrolledLesson;
    })
    return enrolledLessonIndex;
  }

  const getCourseLessons = (enrolledCourse: EnrolledCourse) => {
    return (
      <div>
        {enrolledCourse.enrolledLessons.map(function (enrolledLesson, lessonId) {
          return (
            <>
              <CourseElement key={lessonId}>
                <LessonAvatar
                  src={displayBannerUrl(enrolledCourse)}
                  alt={enrolledCourse.parentCourse.name}
                />
                <SubjectContainer>
                  <Subject>{enrolledLesson?.parentLesson.name}</Subject>
                </SubjectContainer>
                <MultimediaModal
                  show={showMultimedia}
                  account={myAccount}
                  lesson={enrolledLesson.parentLesson}
                />
                <div style={{ width: "100px" }}>
                  {enrolledCourse.dateTimeOfCompletion === null ? (
                    enrolledLesson.dateTimeOfCompletion !== null ||
                      lessonId < getLatestLessonToResume(enrolledCourse.enrolledLessons) ? (
                        <Button
                          variant="outlined"
                          primary={true}
                          style={{width:"20px"}}
                          to={`/overview/course/${enrolledCourse.enrolledCourseId}/lesson/${enrolledLesson.enrolledLessonId}`}
                        >
                          { enrolledLesson.dateTimeOfCompletion ? "View" : "Resume" }
                        </Button>
                      ) : (
                        <Button variant="outlined" 
                        primary={false} 
                        style={{width:"20px"}}
                        disabled>
                          <LockIcon />
                        </Button>
                      )
                  ) : (
                      <Button
                        primary={true}
                        style={{width:"20px"}}
                        to={`/overview/course/${enrolledCourse.enrolledCourseId}/lesson/${enrolledLesson.enrolledLessonId}`}
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
      { curTabIdx === 0 && 
        <>
          <Typography>You are not enrolled in any courses 🥺</Typography>
          <br/>
          <Button
              onClick={navigateToBrowseCoursePage}
              style={{ width: "10%" }}
              big
          >
            Browse Courses
          </Button>
        </>
      }
      { curTabIdx === 1 && <Typography>You have not completed any courses 🥸</Typography>}
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
