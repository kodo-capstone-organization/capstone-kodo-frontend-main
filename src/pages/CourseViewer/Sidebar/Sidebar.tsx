import React, { useState, useEffect } from "react";
import { Course } from "../../../apis/Entities/Course";

import {
  SidebarContainer,
  SidebarWrapper,
  SidebarMenu,
  CourseBannerWrapper,
  CourseBanner,
  SidebarLink,
  LessonLink
} from "./SidebarElements";

function Sidebar(props: any) {
  const [currentCourse, setCourse] = useState<Course>({ ...props.course });

  useEffect(() => {
    setCourse(props.course);
  }, [props.course]);

  let allLessons = currentCourse?.lessons;

  return (
    <SidebarContainer>
      <SidebarWrapper>
        <CourseBannerWrapper>
            <CourseBanner src="/chessplaceholder.png" alt={currentCourse.name}/>
        </CourseBannerWrapper>
        <SidebarMenu>
          <SidebarLink>Overview</SidebarLink>
          {allLessons?.map(lesson => {
            return (
              <LessonLink key={lesson.lessonId}>
                <SidebarLink>{lesson.name}</SidebarLink>
              </LessonLink>
            );
          })}
          <SidebarLink>Discussion Forum</SidebarLink>
        </SidebarMenu>
      </SidebarWrapper>
    </SidebarContainer>
  );
}

export default Sidebar;