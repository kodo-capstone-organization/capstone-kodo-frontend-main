import React, { useState, useEffect } from "react";
import {
  TutorContainer,
  PageHeading,
  CourseTitle,
  TutorTitle,
  StudentProgressCard,
  CardTitle,
  StudentProgressWrapper
} from "./TutorViewElements";

function TutorView() {
  return (
    <TutorContainer>
        <PageHeading>
            <CourseTitle>Python for Beginners</CourseTitle>
            <TutorTitle>by Nelson Jamal</TutorTitle>
        </PageHeading>
        <StudentProgressCard>
            <CardTitle>Students</CardTitle>
            <StudentProgressWrapper>
                WASSUP
            </StudentProgressWrapper>
        </StudentProgressCard>
    </TutorContainer>
  );
}

export default TutorView;
