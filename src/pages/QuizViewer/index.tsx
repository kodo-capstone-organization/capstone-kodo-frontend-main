import React, { useEffect, useState } from "react";
import { StudentAttempt } from "../../apis/Entities/StudentAttempt";
import { StudentAttemptQuestion } from "../../apis/Entities/StudentAttemptQuestion";
import { Quiz } from "../../apis/Entities/Quiz";
import { QuizQuestion } from "../../apis/Entities/QuizQuestion";
import { getStudentAttemptByStudentAttemptId } from "../../apis/StudentAttempt/StudentAttemptApis";

import MarkedQuizComponent from "./components/MarkedQuizComponent";


import {
    QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard,
    QuizViewerCardContent
} from "./QuizViewerElements";
import {
    Grid, Divider
} from "@material-ui/core";

function QuizViewer(props: any) {
    const studentAttemptId = props.match.params.studentAttemptId;
    const [studentAttempt, setStudentAttempt] = useState<StudentAttempt>();
    const [studentAttemptQuestions, setStudentAttemptQuestions] = useState<StudentAttemptQuestion[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [quiz, setQuiz] = useState<Quiz>();
    const [dateTimeOfAttempt, setDateTimeOfAttempt] = useState<string>("");


    useEffect(() => {
        setLoading(true);
        getStudentAttemptByStudentAttemptId(studentAttemptId).then(studentAttempt => {
            console.log(studentAttempt);
            setStudentAttempt(studentAttempt);
            setQuiz(studentAttempt.quiz);
            setDateTimeOfAttempt(studentAttempt.dateTimeOfAttempt);
            setStudentAttemptQuestions(studentAttempt.studentAttemptQuestions);
        });
        setLoading(false);
    }, []);

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    const mapQuestionArray = (attemptArray: StudentAttemptQuestion[]) => {
        return (
            <div>
                {attemptArray.map(function (q, qId) {
                    return (
                        <>
                            <QuizQuestionCard key={qId}>
                                <MarkedQuizComponent index={qId} studentAttemptQuestion={q} />
                            </QuizQuestionCard>
                        </>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <QuizContainer>
                <QuizCard>
                    <QuizCardHeader
                        title="Quiz Information"
                    />
                    <QuizCardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {quiz != undefined && quiz.name}
                            </Grid>
                            <Divider style={{width:'-webkit-fill-available'}} variant="middle" />
                            <Grid item xs={12}>
                                {quiz != undefined && quiz.description}
                            </Grid>
                            <Divider style={{width:'-webkit-fill-available'}} variant="middle" />
                            <Grid item xs={12}>
                                Completed On: {dateTimeOfAttempt != undefined && formatDate(dateTimeOfAttempt)}
                            </Grid>
                        </Grid>
                    </QuizCardContent>
                </QuizCard>

                <QuizCard>
                    <QuizCardHeader
                        title="Quiz Viewer" />
                    <QuizViewerCardContent>
                        {mapQuestionArray(studentAttemptQuestions)}
                    </QuizViewerCardContent>
                </QuizCard>
            </QuizContainer>
        </>
    );
}

export default QuizViewer;

// { studentAttemptId }
// <table border="1">
//         <tr>
//             <th>Question</th>
//             <th>Marks</th>
//             <th>Question Options</th>
//             <th>Student Answers</th>
//         </tr>
// { studentAttempt?.studentAttemptQuestions?.map(studentAttemptQuestion => {
//             return(
//                 <>
//                     <tr>
//                         <td>{ studentAttemptQuestion.quizQuestion.content }</td>
//                         <td>{ studentAttemptQuestion.quizQuestion.marks }</td>                        
//                         <td>
//                             { 
//                                 studentAttemptQuestion.quizQuestion.quizQuestionOptions.map(quizQuestionOption => {
//                                     return(
//                                         <>
//                                             <tr>
//                                                 <td>{ quizQuestionOption.leftContent }</td>
//                                                 <td>{ quizQuestionOption.rightContent }</td>
//                                                 <td>{ quizQuestionOption.correct ? 'correct' : '' }</td>
//                                             </tr>
//                                         </>
//                                     )
//                                 })                                        
//                             }                                    
//                         </td>
//                         <td>
//                             {studentAttemptQuestion.studentAttemptAnswers.length}
//                             {                                             
//                                 studentAttemptQuestion.studentAttemptAnswers.map(studentAttemptAnswer => {
//                                     return(
//                                         <>
//                                             <tr>
//                                                 <td>{ studentAttemptAnswer.leftContent }</td>
//                                                 <td>{ studentAttemptAnswer.rightContent }</td>
//                                                 <td>{ studentAttemptAnswer.correct ? 'true' : 'false' }</td>
//                                             </tr>
//                                         </>
//                                     )
//                                 })                                        
//                             }                                    
//                         </td>
//                     </tr>
//                 </>
//             )
//         }
//     )
// }
// </table>
