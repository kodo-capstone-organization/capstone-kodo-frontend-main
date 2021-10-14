import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {
    Grid,
    Divider
} from "@material-ui/core";

import { CreateNewStudentAttemptReq } from "../../../apis/Entities/StudentAttempt";
import { Quiz } from "../../../apis/Entities/Quiz";
import { QuizQuestion } from "../../../apis/Entities/QuizQuestion";

import { createNewStudentAttempt } from "../../../apis/StudentAttempt/StudentAttemptApis";
import { getAllQuizQuestionsByQuizId } from "../../../apis/QuizQuestion/QuizQuestionApis";
import { getEnrolledContentByEnrolledContentIdAndAccountId } from "../../../apis/EnrolledContent/EnrolledContentApis";
import { getEnrolledCourseByEnrolledCourseIdAndAccountId } from "../../../apis/EnrolledCourse/EnrolledCourseApis"
import { getEnrolledLessonByEnrolledLessonIdAndAccountId } from "../../../apis/EnrolledLesson/EnrolledLessonApis"
import { getQuizByQuizId } from "../../../apis/Quiz/QuizApis";

import {
    QuizCard,
    QuizCardContent,
    QuizCardFooter,
    QuizCardHeader,
    QuizQuestionCard,
    QuizViewerCardContent
} from "../QuizViewerElements";

import AttemptQuizOptionsComponent from "./AttemptQuizOptionsComponent";
import QuizAttemptTimer from "./QuizAttemptTimer";
import QuizTimedOutModal from "./QuizTimedOutModal";

import { Button } from "../../../values/ButtonElements";
import { EnrolledContent } from "../../../apis/Entities/EnrolledContent";


function AttemptQuizComponent(props: any) {
    const enrolledLessonId = props.enrolledLessonId;
    const enrolledCourseId = props.enrolledCourseId;
    const enrolledContentId = props.enrolledContentId;

    const [quiz, setQuiz] = useState<Quiz>();
    const [quizQuestionArray, setQuizQuestionArray] = useState<QuizQuestion[]>();
    const [unshuffledQuizQuestionIdArray, setUnshuffledQuizQuestionIdArray] = useState<any[]>();
    const [quizQuestionOptionIdList, setQuizQuestionOptionIdList] = useState<number[][][]>([]);
    const [unshuffledQuizQuestionOptionIdList, setUnshuffledQuizQuestionOptionIdList] = useState<any[][][]>();
    const [initialSeconds, setInitalSeconds] = useState<number>();
    const [initialMinutes, setInitialMinutes] = useState<number>();

    const [createNewStudentAttemptReq, setCreateNewStudentAttemptReq] = useState<CreateNewStudentAttemptReq>();

    const history = useHistory();
    const [timeout, setTimeout] = useState<boolean>(false);

    const accountId = JSON.parse(window.sessionStorage.getItem("loggedInAccountId") || "{}");

    useEffect(() => {
        getEnrolledCourseByEnrolledCourseIdAndAccountId(enrolledCourseId, accountId)
            .catch((err) => handleError(err));
    }, [enrolledCourseId, accountId]);

    useEffect(() => {
        getEnrolledLessonByEnrolledLessonIdAndAccountId(enrolledLessonId, accountId)
            .catch((err) => handleError(err));
    }, [enrolledLessonId, accountId]);

    useEffect(() => {
        getEnrolledContentByEnrolledContentIdAndAccountId(enrolledContentId, accountId)
            .then((enrolledContent: EnrolledContent) => {
                const quizId = enrolledContent.parentContent.contentId;
                retrieveQuiz(quizId);
                retrieveAllQuizQuestions(quizId);
            })
            .catch(err => handleError(err));
    }, [enrolledContentId, accountId]);

    function retrieveQuiz(quizId: number): void {
        getQuizByQuizId(quizId)
            .then((quiz: Quiz) => {
                setQuiz(quiz);
                setInitialMinutes(parseInt(`${quiz.timeLimit.charAt(3)}${quiz.timeLimit.charAt(4)}`));
                setInitalSeconds(parseInt(`${quiz.timeLimit.charAt(6)}${quiz.timeLimit.charAt(7)}`));
            })
            .catch(err => handleError(err));
    }

    function retrieveAllQuizQuestions(quizId: number): void {
        getAllQuizQuestionsByQuizId(quizId)
            .then((res) => {
                var unshuffledQuestionIds : any[] = [];
                res.map((question) => {
                    unshuffledQuestionIds.concat([question.quizQuestionId])
                })
                console.log("unshuffledQuestionIdArray", unshuffledQuestionIds);
                setUnshuffledQuizQuestionIdArray(unshuffledQuestionIds);
                setQuizQuestionArray(res)
            })
            .catch((err) => handleError(err));
    }

    function handleError(err: any): void {
        const errorDataObj = createErrorDataObj(err);
        props.callOpenSnackBar("Error in retrieving quiz", "error");
        history.push({ pathname: "/invalidpage", state: { errorData: errorDataObj } })
    }

    function createErrorDataObj(err: any): any {
        const errorDataObj = {
            message1: 'Unable to view quiz',
            message2: err.response.data.message,
            errorStatus: err.response.status,
            returnPath: '/progresspage',
            returnText: 'My Progress'
        }

        return errorDataObj;
    }

    const handleAttemptAnswer = (optionArray: number[][], questionIndex: number) => {
        var newQuizQuestionOptionIdList = quizQuestionOptionIdList;
        newQuizQuestionOptionIdList[questionIndex] = optionArray;
        console.log("handleAttemptAnswer", newQuizQuestionOptionIdList);
        setQuizQuestionOptionIdList(newQuizQuestionOptionIdList);
    }

    const handleSubmit = () => {
        var newQuizQuestionOptionIdList = quizQuestionOptionIdList;
        quizQuestionArray?.map((q, qId) => {
            if (qId in quizQuestionOptionIdList) {
            } else {
                newQuizQuestionOptionIdList[qId] = [[]];
            }
        })
        const createNewStudentAttemptReq: CreateNewStudentAttemptReq = {
            enrolledContentId: parseInt(props.enrolledContentId),
            quizQuestionOptionIdLists: newQuizQuestionOptionIdList
        };
        createNewStudentAttempt(createNewStudentAttemptReq)
            .then(res => {
                props.callOpenSnackBar("Quiz Submitted Successfully", "success")

                history.push(`/overview/course/${props.enrolledCourseId}/lesson/${props.enrolledLessonId}`);
            })
            .catch(err => {
                props.callOpenSnackBar("There was an error in submitting the quiz", "error")
            });

    }

    const handleTimeOut = () => {
        var newQuizQuestionOptionIdList = quizQuestionOptionIdList;
        quizQuestionArray?.map((q, qId) => {
            if (qId in quizQuestionOptionIdList) {
            } else {
                newQuizQuestionOptionIdList[qId] = [[]];
            }
        })

        const tmpCreateNewStudentAttemptReq: CreateNewStudentAttemptReq = {
            enrolledContentId: props.enrolledContentId,
            quizQuestionOptionIdLists: newQuizQuestionOptionIdList
        };

        setCreateNewStudentAttemptReq(tmpCreateNewStudentAttemptReq);
        setTimeout(true);
    }

    const mapQuestionArray = (questionArray: QuizQuestion[]) => {
        return (
            <div>
                {questionArray.map((question, qId) => {
                    return (
                        <>
                            <QuizQuestionCard key={qId}>
                                {qId + 1}. {question.content} ({question.marks} mark{question.marks === 1 ? "" : "s"})
                                <AttemptQuizOptionsComponent question={question} index={qId} onHandleAttemptAnswer={handleAttemptAnswer} />
                            </QuizQuestionCard>
                        </>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {/* {initialSeconds != undefined && <QuizAttemptTimer initialSeconds={initialSeconds} initialMinutes={initialMinutes} onTimeOut={handleTimeOut} />}
            <QuizTimedOutModal open={timeout} enrolledContentId={props.enrolledContentId} callOpenSnackBar={props.callOpenSnackBar} createNewStudentAttemptReq={createNewStudentAttemptReq} /> */}
            <QuizCard>
                <QuizCardHeader
                    title="Quiz Information"
                />
                <QuizCardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            Name: {quiz !== undefined && quiz.name}
                        </Grid>
                        <Divider style={{ width: '-webkit-fill-available' }} variant="middle" />
                        <Grid item xs={12}>
                            Description: {quiz !== undefined && quiz.description}
                        </Grid>
                    </Grid>
                </QuizCardContent>
            </QuizCard>
            <QuizCard>
                <QuizCardHeader
                    title={quiz !== undefined ? quiz.name : ""}
                    action={
                        <Button primary onClick={handleSubmit}>Submit Quiz</Button>
                    }
                />
                <QuizViewerCardContent>
                    {quizQuestionArray !== undefined && mapQuestionArray(quizQuestionArray)}
                </QuizViewerCardContent>
                <QuizCardFooter
                    action={
                        <Button primary onClick={handleSubmit}>Submit Quiz</Button>
                    }
                />
            </QuizCard>
        </>
    );
}

export default AttemptQuizComponent;
