import { useEffect, useState } from "react";

import {
    Grid,
    Divider
} from "@material-ui/core";

import { CreateNewStudentAttemptReq } from "../../../apis/Entities/StudentAttempt";
import { Quiz } from "../../../apis/Entities/Quiz";
import { QuizQuestion } from "../../../apis/Entities/QuizQuestion";

import { createNewStudentAttempt } from "../../../apis/StudentAttempt/StudentAttemptApis";
import { getAllQuizQuestionsByQuizId } from "../../../apis/QuizQuestion/QuizQuestionApis";
import { getEnrolledContentByEnrolledContentId } from "../../../apis/EnrolledContent/EnrolledContentApis";
import { getQuizByQuizId } from "../../../apis/Quiz/QuizApis";

import {
    QuizCard, 
    QuizCardContent, 
    QuizCardHeader, 
    QuizQuestionCard,
    QuizViewerCardContent
} from "../QuizViewerElements";

import AttemptQuizOptionsComponent from "./AttemptQuizOptionsComponent";
import QuizAttemptTimer from "./QuizAttemptTimer";

import { Button } from "../../../values/ButtonElements";

function AttemptQuizComponent(props: any) {

    const [quiz, setQuiz] = useState<Quiz>();
    const [quizQuestionArray, setQuizQuestionArray] = useState<QuizQuestion[]>();
    const [quizQuestionOptionIdList, setQuizQuestionOptionIdList] = useState<number[][][]>([]);
    const [initialSeconds, setInitalSeconds] = useState<number>();
    const [initialMinutes, setInitialMinutes] = useState<number>();




    useEffect(() => {
        if (props.enrolledContentId !== undefined) {
            console.log(props.enrolledContentId)
            getEnrolledContentByEnrolledContentId(props.enrolledContentId)
                .then(res => {
                    console.log("Success in getEnrolledContentByEnrolledContentId", res);
                    const quizId = res.parentContent.contentId;
                    getQuizByQuizId(quizId)
                        .then(res => {
                            setQuiz(res);
                            console.log(res.timeLimit);
                            setInitialMinutes(parseInt(`${res.timeLimit.charAt(3)}${res.timeLimit.charAt(4)}`));
                            setInitalSeconds(parseInt(`${res.timeLimit.charAt(6)}${res.timeLimit.charAt(7)}`));
                            console.log("Success in getQuizByQuizId", res);
                        })
                        .catch(err => { console.log("Error in getQuizByQuizId", err); })
                    getAllQuizQuestionsByQuizId(quizId).then((res) => {
                        setQuizQuestionArray(res)
                        console.log("Success in getAllQuizQuestionsByQuizId", res);
                    }).catch((err) => { console.log("error:getAllQuizQuestionsByQuizId", err) });
                })
                .catch(err => {
                    console.log("Error in getEnrolledContentByEnrolledContentId", err);
                })
        }
    }, [props.enrolledContentId]);

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const handleAttemptAnswer = (optionArray: number[], questionIndex: number) => {
        var newQuizQuestionOptionIdList = quizQuestionOptionIdList;
        newQuizQuestionOptionIdList[questionIndex] = optionArray;
        console.log("handleAttemptAnswer", newQuizQuestionOptionIdList);
        setQuizQuestionOptionIdList(newQuizQuestionOptionIdList);
    }

    const handleSubmit = () => {
        if (quizQuestionOptionIdList.length === quizQuestionArray?.length) {
            const createNewStudentAttemptReq: CreateNewStudentAttemptReq = {
                enrolledContentId: parseInt(props.enrolledContentId),
                quizQuestionOptionIdLists: quizQuestionOptionIdList
            };
            console.log("createNewStudentAttemptReq, quizQuestionOptionIdList", quizQuestionOptionIdList[2]);
            createNewStudentAttempt(createNewStudentAttemptReq)
            .then(res => {
                console.log("Attempt quiz success:", res);
            })
            .catch(err => {
                console.log("Attempt quiz failed:", err);
            });
        } else {
            console.log("Hey! complete the damn quiz!");
            //send error
        }

    }

    const handleTimeOut = (isTimedOut : boolean) => {
        //complete the quiz
        console.log("timeout")
        var newQuizQuestionOptionIdList = quizQuestionOptionIdList;
        quizQuestionArray?.map((q, qId) => {
            if(qId in quizQuestionOptionIdList){
                console.log(`${qId} in ${quizQuestionOptionIdList}`)
            }else{
                console.log(`${qId} not in ${quizQuestionOptionIdList}`)
                newQuizQuestionOptionIdList[qId] = [[]];
            }
        })
        const createNewStudentAttemptReq: CreateNewStudentAttemptReq = {
            enrolledContentId: props.enrolledContentId,
            quizQuestionOptionIdLists: newQuizQuestionOptionIdList
        };
        console.log("createNewStudentAttemptReq", createNewStudentAttemptReq);
        createNewStudentAttempt(createNewStudentAttemptReq)
        .then(res => {
            console.log("Attempt quiz success:", res);
        })
        .catch(err => {
            console.log("Attempt quiz failed:", err);
        });
    } 

    const mapQuestionArray = (questionArray: QuizQuestion[]) => {
        return (
            <div>
                {questionArray.map((question, qId) => {
                    return (
                        <>
                            <QuizQuestionCard key={qId}>
                                {qId + 1}. {question.content}
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
            {initialSeconds !== undefined && <QuizAttemptTimer initialSeconds={initialSeconds} initialMinutes={initialMinutes} onTimeOut={handleTimeOut}/>}
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
            </QuizCard>
        </>
    );
}

export default AttemptQuizComponent;
