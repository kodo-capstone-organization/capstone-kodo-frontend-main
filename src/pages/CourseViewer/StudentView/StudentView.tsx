import React, { useEffect, useState } from "react";
import { getEnrolledCourseByStudentIdAndCourseId, setCourseRatingByEnrolledCourseId } from "../../../apis/EnrolledCourse/EnrolledCourseApis";
import { EnrolledCourse } from "../../../apis/Entities/EnrolledCourse";
import { Course } from "../../../apis/Entities/Course";

function StudentView(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse>();

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    setCourse(props.course);
  }, [props.course]);

  useEffect(() => {
    getEnrolledCourseByStudentIdAndCourseId(accountId, currentCourse.courseId).then(receivedEnrolledCourse => {
      setEnrolledCourse(receivedEnrolledCourse);
    });
  }, []);

  console.log(enrolledCourse)

  return (
    <div>
      <div className="stepper">
        <h1>student view</h1>
      </div>

      <div className="rating"></div>
    </div>
  );
}

export default StudentView;
