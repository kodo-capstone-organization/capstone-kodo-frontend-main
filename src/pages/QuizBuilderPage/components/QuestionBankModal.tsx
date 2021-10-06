import { useEffect, useState } from 'react';

import {
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText,
    DialogTitle, 
} from "@material-ui/core";
import { 
    DataGrid, 
    GridColDef, 
    GridValueGetterParams 
} from '@material-ui/data-grid';

import { getAllQuizQuestionsByTutorId } from "../../../apis/QuizQuestion/QuizQuestionApis";

import { Button } from "../../../values/ButtonElements";

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

function QuestionBankModal(props: any) {

    const [open, setOpen] = useState<boolean>(false);
    const [questionList, setQuestionList] = useState<any[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<any>([]);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const accountId = window.sessionStorage.getItem("loggedInAccountId");

    useEffect(() => {
        if (accountId !== null) {
            getAllQuizQuestionsByTutorId(parseInt(accountId))
                .then(res => {
                    res.map((q) => { 
                        Object.assign(q, { id: q.quizQuestionId, quizQuestionsLength: q.quizQuestionOptions.length }) 
                        return q;
                    });
                    setQuestionList(res);
                })
                .catch(err => { console.log("Question Bank Failed", err) })
        }
        setIsDisabled(props.disabled);
        const newSelected = props.selectedFromQuestionBank.map(x => x.quizQuestionId);
        console.log("props.selectedFromQuestionBank",props.selectedFromQuestionBank);
        console.log("props.selectedFromQuestionBank",newSelected);

        setSelectedQuestions(newSelected);
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
        const selectedFromQuestionBank = questionList.filter((q)=>selectedQuestions.includes(q.quizQuestionId));
        props.onChangeFromQuestionBank(selectedFromQuestionBank);
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
                                selectionModel={selectedQuestions}
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