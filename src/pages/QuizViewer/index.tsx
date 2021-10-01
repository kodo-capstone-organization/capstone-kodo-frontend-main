import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { StudentAttempt } from "../../apis/Entities/StudentAttempt";
import { StudentAttemptQuestion } from "../../apis/Entities/StudentAttemptQuestion";
import { Quiz } from "../../apis/Entities/Quiz";
import { QuizQuestion } from "../../apis/Entities/QuizQuestion";
import { getStudentAttemptByStudentAttemptId } from "../../apis/StudentAttempt/StudentAttemptApis";
import { getQuizByQuizId } from "../../apis/Quiz/QuizApis";

import MarkedQuizComponent from "./components/MarkedQuizComponent";
import AttemptQuizComponent from "./components/AttemptQuizComponent";


import {
    QuizContainer, QuizCard, QuizCardHeader, QuizCardContent, QuizQuestionCard,
    QuizViewerCardContent
} from "./QuizViewerElements";
import {
    Grid, Divider, makeStyles, createStyles, Theme,
    createMuiTheme, ThemeProvider, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow,
} from "@material-ui/core";

const themeInstance = createMuiTheme({
    overrides: {
        MuiTableRow: {
            root: {
                '&.Mui-selected': {
                    backgroundColor: "#C8E6C9 ! important"
                }
            }
        }
    }
});

function QuizViewer(props: any) {
    const studentAttemptId = props.match.params.studentAttemptId;
    const enrolledContentId = props.match.params.enrolledContentId;
    const [loading, setLoading] = useState<Boolean>(true);
    const [quiz, setQuiz] = useState<Quiz>();
    const [dateTimeOfAttempt, setDateTimeOfAttempt] = useState<string>("");
    const [viewMode, setViewMode] = useState<boolean>(false);
    const [attemptMode, setAttemptMode] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        if(props.match.params.studentAttemptId){
            setViewMode(true);
        }else if (props.match.params.enrolledContentId){
            setAttemptMode(true);
        }
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
                {viewMode && <MarkedQuizComponent studentAttemptId={studentAttemptId} />}
                {attemptMode && <AttemptQuizComponent enrolledContentId={enrolledContentId} />}

            </QuizContainer>
        </>
    );
}

export default QuizViewer;