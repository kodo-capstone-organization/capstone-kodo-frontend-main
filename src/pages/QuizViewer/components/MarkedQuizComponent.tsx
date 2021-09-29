import React, { useEffect, useState } from "react";
import { StudentAttempt } from "../../../apis/Entities/StudentAttempt";
import { Quiz } from "../../../apis/Entities/Quiz";
import { getStudentAttemptByStudentAttemptId } from "../../../apis/StudentAttempt/StudentAttemptApis";

import { QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard,
    QuizViewerCardContent } from "../QuizViewerElements";
import {
    Grid
} from "@material-ui/core";

function MarkedQuizComponent(props: any) {
    // const studentAttemptId = props.match.params.studentAttemptId;
    const [studentAttempt, setStudentAttempt] = useState<StudentAttempt>();
    const [loading, setLoading] = useState<Boolean>(true);
    const [quiz, setQuiz] = useState<Quiz>();
    const [dateTimeOfAttempt, setDateTimeOfAttempt] = useState<string>("");


    useEffect(() => {
        // setLoading(true);
        // getStudentAttemptByStudentAttemptId(studentAttemptId).then(studentAttempt => {
        //     console.log(studentAttempt);
        //     setStudentAttempt(studentAttempt);
        //     setQuiz(studentAttempt.quiz);
        //     setDateTimeOfAttempt(studentAttempt.dateTimeOfAttempt);
        // });
        // setLoading(false);
    }, []);

    const formatDate = (date: Date) => {
        var d = new Date(date);
        return d.toDateString() + ', ' + d.toLocaleTimeString();
    }

    return (
        <>
        </>
    );
}

export default MarkedQuizComponent;

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
