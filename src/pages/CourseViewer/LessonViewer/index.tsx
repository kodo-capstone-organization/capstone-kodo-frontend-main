import React, {useState, useEffect} from "react";
import { withRouter } from "react-router";
import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getLessonByLessonId } from "../../../apis/Lesson/LessonApis";

import { Course } from '../../../apis/Entities/Course';
import { Lesson } from '../../../apis/Entities/Lesson';



import { LessonContainer, LessonCard } from "./LessonViewerElements";
import Sidebar from "../Sidebar/Sidebar";

function LessonViewer(props: any) {
  const lessonId = props.match.params.lessonId;
  const courseId = props.match.params.courseId;
  const [currentCourse, setCourse] = useState<Course>();
  const [currentLesson, setLesson] = useState<Lesson>();

  useEffect(() => {
    getCourseByCourseId(courseId).then(receivedCourse => {
      setCourse(receivedCourse);
    });
  }, []);
  console.log(currentCourse)

  useEffect(() => {
    getLessonByLessonId(lessonId).then(receivedLesson => {
      setLesson(receivedLesson);
    });
  }, []);

  console.log(currentLesson);


  return (
    <LessonContainer>
      <h1>{currentCourse?.name}</h1>
      <h3>{currentLesson?.name}</h3>
    </LessonContainer>
  );
}

const LessonViewerWithRouter = withRouter(LessonViewer);
export default LessonViewerWithRouter;
