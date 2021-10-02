import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { createMuiTheme } from "@material-ui/core";

import {
    QuizContainer,
    QuizQuestionCard
} from "./QuizViewerElements";

import { StudentAttemptQuestion } from "../../apis/Entities/StudentAttemptQuestion";
import { Quiz } from "../../apis/Entities/Quiz";

import MarkedQuizComponent from "./components/MarkedQuizComponent";
import AttemptQuizComponent from "./components/AttemptQuizComponent";


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
        if (props.match.params.studentAttemptId) {
            setViewMode(true);
        } else if (props.match.params.enrolledContentId) {
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
                {attemptMode && <AttemptQuizComponent enrolledContentId={enrolledContentId} callOpenSnackBar={props.callOpenSnackBar} />}

            </QuizContainer>
        </>
    );
}

export default QuizViewer;