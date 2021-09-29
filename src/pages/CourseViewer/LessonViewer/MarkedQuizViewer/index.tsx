import React, { useEffect, useState } from "react";
import { StudentAttempt } from "../../../../apis/Entities/StudentAttempt";
import { getStudentAttemptByStudentAttemptId } from "../../../../apis/StudentAttempt/StudentAttemptApis";

function MarkedQuizViewer(props: any) {
    const studentAttemptId = props.match.params.studentAttemptId;
    const [studentAttempt, setStudentAttempt] = useState<StudentAttempt>();
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        setLoading(true);
        getStudentAttemptByStudentAttemptId(studentAttemptId).then(studentAttempt => {
            setStudentAttempt(studentAttempt);
        });
        setLoading(false);
    }, []);

    return (
        <>
            { studentAttemptId }
            <table border="1">
                    <tr>
                        <th>Question</th>
                        <th>Marks</th>
                        <th>Question Options</th>
                        <th>Student Answers</th>
                    </tr>
            { studentAttempt?.studentAttemptQuestions?.map(studentAttemptQuestion => {
                        return(
                            <>
                                <tr>
                                    <td>{ studentAttemptQuestion.quizQuestion.content }</td>
                                    <td>{ studentAttemptQuestion.quizQuestion.marks }</td>                        
                                    <td>
                                        { 
                                            studentAttemptQuestion.quizQuestion.quizQuestionOptions.map(quizQuestionOption => {
                                                return(
                                                    <>
                                                        <tr>
                                                            <td>{ quizQuestionOption.leftContent }</td>
                                                            <td>{ quizQuestionOption.rightContent }</td>
                                                            <td>{ quizQuestionOption.correct ? 'correct' : '' }</td>
                                                        </tr>
                                                    </>
                                                )
                                            })                                        
                                        }                                    
                                    </td>
                                    <td>
                                        {studentAttemptQuestion.studentAttemptAnswers.length}
                                        {                                             
                                            studentAttemptQuestion.studentAttemptAnswers.map(studentAttemptAnswer => {
                                                return(
                                                    <>
                                                        <tr>
                                                            <td>{ studentAttemptAnswer.leftContent }</td>
                                                            <td>{ studentAttemptAnswer.rightContent }</td>
                                                            <td>{ studentAttemptAnswer.correct ? 'true' : 'false' }</td>
                                                        </tr>
                                                    </>
                                                )
                                            })                                        
                                        }                                    
                                    </td>
                                </tr>
                            </>
                        )
                    }
                )
            }
            </table>
        </>
    );
}

export default MarkedQuizViewer;
