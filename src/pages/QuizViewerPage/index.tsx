import { useEffect, useState } from "react";

import {
    QuizContainer
} from "./QuizViewerElements";

import MarkedQuizComponent from "./components/MarkedQuizComponent";
import AttemptQuizComponent from "./components/AttemptQuizComponent";

function QuizViewer(props: any) {
    const studentAttemptId = props.match.params.studentAttemptId;
    const enrolledCourseId = props.match.params.enrolledCourseId;
    const enrolledLessonId = props.match.params.enrolledLessonId;
    const enrolledContentId = props.match.params.enrolledContentId;
    const [viewMode, setViewMode] = useState<boolean>(false);
    const [attemptMode, setAttemptMode] = useState<boolean>(false);

    useEffect(() => {
        if (props.match.params.studentAttemptId) {
            setViewMode(true);
        } else if (props.match.params.enrolledContentId) {
            setAttemptMode(true);
        }
    }, []);

    return (
        <>
            <QuizContainer>
                {viewMode && <MarkedQuizComponent enrolledCourseId={enrolledCourseId} enrolledLessonId={enrolledLessonId} studentAttemptId={studentAttemptId} callOpenSnackBar={props.callOpenSnackBar} />}
                {attemptMode && <AttemptQuizComponent key={"attemptQuiz"} enrolledCourseId={enrolledCourseId} enrolledLessonId={enrolledLessonId} enrolledContentId={enrolledContentId} callOpenSnackBar={props.callOpenSnackBar} />}
            </QuizContainer>
        </>
    );
}

export default QuizViewer;