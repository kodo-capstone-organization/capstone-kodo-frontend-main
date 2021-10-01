import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme, createStyles, withStyles, lighten } from '@material-ui/core/styles';
import { getAllQuizQuestionsByTutorId } from "../../../apis/QuizQuestion/QuizQuestionApis";
import { QuizQuestionOption } from '../../../apis/Entities/QuizQuestionOption';
import { Button } from "../../../values/ButtonElements";
import {
    Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText
} from "@material-ui/core";
import { Quiz } from '../../../apis/Entities/Quiz';
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';

interface Data {
    content: string;
    marks: number;
    questionType: string;
    quiz: Quiz;
    quizQuestionId: number;
    quizQuestionOptions: QuizQuestionOption[];
}

const columns: GridColDef[] = [
    {
        field: 'id', headerName: 'ID', width: 90,
        valueGetter: (params: GridValueGetterParams) => params.getValue(params.id, 'quizQuestionId'),
    },
    {
        field: 'content',
        headerName: 'Content',
        width: 500,
    },
    {
        field: 'questionType',
        headerName: 'Question Type',
        width: 150,
    },
    // {
    //     field: 'quiz',
    //     headerName: 'Quiz',
    //     type: 'object',
    //     width: 110,
    //     editable: true,
    // },
    // {
    //     field: 'quizQuestionId',
    //     headerName: 'Quiz Question Id',
    //     type: 'number',
    //     width: 110,
    //     editable: true,
    // },
    {
        field: 'quizQuestionOptions',
        headerName: 'Options',
        type: 'number',
        width: 150,
        valueGetter: (params: GridValueGetterParams) => params.getValue(params.id, 'quizQuestionsLength'),
    }
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        dialogPaper: {
            height: "400px",
            width: 1000,
        },
    }),
);

function QuestionBankModal(props: any) {

    const [open, setOpen] = useState<boolean>(false);
    const [questionList, setQuestionList] = useState<any[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<any>([]);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const accountId = window.sessionStorage.getItem("loggedInAccountId");
    const classes = useStyles();
    const history = useHistory();


    useEffect(() => {
        if (accountId !== null) {
            getAllQuizQuestionsByTutorId(parseInt(accountId))
                .then(res => {
                    res.map((q) => { Object.assign(q, { id: q.quizQuestionId, quizQuestionsLength: q.quizQuestionOptions.length }) });
                    console.log("Question Bank Success", res);
                    setQuestionList(res);
                })
                .catch(err => { console.log("Question Bank Failed", err) })
        }
        setIsDisabled(props.disabled);
        console.log("props.disabled", props.disabled)
    }, [accountId, props.disabled])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const viewSelection = (selection: any) => {
        // returns array of questionId
        setSelectedQuestions(selection)
    }

    const handleConfirm = () => {
        props.onChangeFromQuestionBank(selectedQuestions)
        setOpen(false);
    }


    return (
        <>
            <div>
                <Button disabled={isDisabled} onClick={handleOpen}>
                    Add From Question Bank
                </Button>
                <Dialog open={open} onClose={handleClose} maxWidth={"lg"}>
                    <DialogTitle>Question Bank</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Reuse questions you've made before with Question Bank!
                        </DialogContentText>
                        <div style={{ height: 400, width: '1000px' }}>
                            {/* consider filtering */}
                            <DataGrid
                                rows={questionList}
                                columns={columns}
                                pageSize={5}
                                checkboxSelection
                                disableSelectionOnClick
                                onSelectionModelChange={(newSelection) => {
                                    viewSelection(newSelection);
                                }}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleConfirm}>Confirm</Button>
                    </DialogActions>
                </Dialog>

            </div>
        </>
    )
}

export default QuestionBankModal;