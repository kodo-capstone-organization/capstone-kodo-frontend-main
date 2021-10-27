import { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { Content } from "../../../../../entities/Content";
import { EnrolledContent } from "../../../../../entities/EnrolledContent";
import { EnrolledCourse } from "../../../../../entities/EnrolledCourse";
import { EnrolledLesson } from "../../../../../entities/EnrolledLesson";
import { Quiz } from "../../../../../entities/Quiz";

import { 
    BtnWrapper,
    LessonViewerCardElement, 
    LessonViewerContentElement,
    LessonViewerHeaderElement, 
    QuizDescription,
    QuizDescriptionTwo,
    QuizRow,
    QuizSubheader,
} from "../LessonViewerElements";

import ViewQuizAttemptsModal from "./ViewQuizAttemptsModal";

import { Button } from "../../../../../values/ButtonElements";


function LessonViewerQuiz(props: any) {

    const enrolledCourse: EnrolledCourse = props.enrolledCourse;
    const enrolledLesson: EnrolledLesson = props.enrolledLesson;
    const enrolledContents: EnrolledContent[] = props.enrolledContents;

    const history = useHistory();

    const [enrolledCourseId, setEnrolledCourseId] = useState<number>(); 
    const [enrolledLessonId, setEnrolledLessonId] = useState<number>();

    useEffect(() => {
        if (enrolledCourse != null)
        {
            setEnrolledCourseId(enrolledCourse.enrolledCourseId);
        }
    }, [enrolledCourse]);

    useEffect(() => {
        if (enrolledLesson != null)
        {
            setEnrolledLessonId(enrolledLesson.enrolledLessonId);
        }
    }, [enrolledLesson]);

    function isQuiz(content: Content): boolean {
        // @ts-ignore
        return content.type === "quiz";
    }

    function formatTime(time: string): string {
        let arr: string[] = time.split(':');
        let hours: number = parseInt(arr[0]);
        let minutes: number = parseInt(arr[1]);
        let seconds: number = parseInt(arr[2]);

        return (hours === 0 ? "" : hours + "h")
            + (minutes === 0 ? "" : minutes + "m ")
            + (seconds === 0 ? "" : seconds + "s ");
    }

    const attemptQuiz = (enrolledContentId: number) => {        
        history.push({ pathname: `/overview/course/${enrolledCourseId}/lesson/${enrolledLessonId}/attemptquizviewer/${enrolledContentId}`, state: { mode: 'ATTEMPT' } });
    }
  
    const showQuizzes = (enrolledContents: EnrolledContent[]) => {
        return (
            enrolledContents.map((enrolledContent: EnrolledContent) => {
                if (isQuiz(enrolledContent.parentContent))
                {
                    let quiz: Quiz = enrolledContent.parentContent as Quiz;
                    return (
                        <>
                            { showQuiz(enrolledContent, quiz) }
                        </>
                    );
                }
            })
        );
    }

    const showQuiz = (enrolledContent: EnrolledContent, quiz: Quiz) => {
        return (
            <>
                { showName(enrolledContent, quiz) }
                <br/>
                { showTimeLimit(quiz) }
                <br/>
                { showStudentAttemptsLeft(enrolledContent, quiz) }
                { showPreviousStudentAttempts(enrolledContent) }
            </>
        );
    }

    const showName = (enrolledContent: EnrolledContent, quiz: Quiz) => {
        return (
            <QuizRow>
                <QuizSubheader>Name:</QuizSubheader>
                <QuizDescription>{ quiz.name }</QuizDescription>
                { showStartButton(enrolledContent, quiz) }
            </QuizRow>
        );
    }

    const showTimeLimit = (quiz: Quiz) => {
        return (
            <QuizRow>
                <QuizSubheader>Time Limit:</QuizSubheader>
                <QuizDescription>{ formatTime(quiz.timeLimit) }</QuizDescription>
            </QuizRow>
        );
    }

    const showStudentAttemptsLeft = (enrolledContent: EnrolledContent, quiz: Quiz) => {
        return (
            <QuizRow>
                <QuizSubheader>No. Attempts Left:</QuizSubheader>
                    <QuizDescriptionTwo>
                        { quiz.maxAttemptsPerStudent - enrolledContent.studentAttempts.length }
                    </QuizDescriptionTwo>
            </QuizRow>
        );
    }

    const showPreviousStudentAttempts = (enrolledContent: EnrolledContent) => {
        return (
            <QuizRow style={{ borderBottom: "none" }}>
                <BtnWrapper>
                    <br/>
                    <ViewQuizAttemptsModal 
                        enrolledCourseId={enrolledCourseId}
                        enrolledLessonId={enrolledLessonId}
                        isButtonDisabled={ !props.previousLessonCompleted() } 
                        studentAttempts={ enrolledContent.studentAttempts }
                    />
                </BtnWrapper>
            </QuizRow>
        );
    }

    const showStartButton = (enrolledContent: EnrolledContent, quiz: Quiz) => {
        return (
            <BtnWrapper>
                { (!props.previousLessonCompleted() 
                    || quiz.maxAttemptsPerStudent === enrolledContent.studentAttempts.length) &&
                    <Button disabled>
                        Start
                    </Button>
                }
                { props.previousLessonCompleted() && enrolledContent.studentAttempts.length > 0 &&
                    <Button primary={true} big={false} fontBig={false} disabled={false}
                        onClick={() => attemptQuiz(enrolledContent.enrolledContentId)}
                    >
                        Start
                    </Button>
                }
            </BtnWrapper>
        );
    }

    return (      
        <>
            { (enrolledContents) &&                
                <LessonViewerCardElement>
                    <LessonViewerHeaderElement title="Quizzes"/>
                    <LessonViewerContentElement>
                        { showQuizzes(enrolledContents) }
                    </LessonViewerContentElement>
                </LessonViewerCardElement>
            }          
        </>
    );
}

export default LessonViewerQuiz;