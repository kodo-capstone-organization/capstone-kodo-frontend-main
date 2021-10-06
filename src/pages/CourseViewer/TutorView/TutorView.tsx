import { Course } from "../../../apis/Entities/Course";

import {
  TutorContainer,
} from "./TutorViewElements";

import TutorViewHeader from "./components/TutorViewHeader";
import TutorViewStudentsProgress from "./components/TutorViewStudentsProgress/TutorViewStudentsProgress";



function TutorView(props: any) {
  
  const course: Course = props.course;

  return (
    <TutorContainer>
      <TutorViewHeader course={course} />
      <TutorViewStudentsProgress course={course} />        
    </TutorContainer>
  );
}

export default TutorView;
