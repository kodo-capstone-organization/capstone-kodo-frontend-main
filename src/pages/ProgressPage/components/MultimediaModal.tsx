import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles, withStyles } from '@material-ui/core/styles';
import {
    IconButton, Dialog, DialogActions, DialogContent, Table,
    DialogTitle, Link, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, Tabs, Tab
} from "@material-ui/core";
import InfoIcon from '@material-ui/icons/Info';
import { Button } from "../../../values/ButtonElements";
import { Account } from "../../../apis/Entities/Account";
import { Quiz } from "../../../apis/Entities/Quiz";
import { Multimedia } from '../../../apis/Entities/Multimedia';
import { useHistory } from 'react-router';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        demo: {
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            margin: theme.spacing(4, 0, 2),
        },
        table: {
            minWidth: 700,
        },
        container: {
            maxHeight: 440,
        },
        dialogPaper: {
            height : "400px",
            width: 1000,
        },
    }),
);

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);


function createData(name: string, url: (string | null)) {
    return { name, url };
}

function MultimediaModal(props: any) {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [myAccount, setMyAccount] = useState<Account>();
    const [multimedias, setMultimedias] = useState<Multimedia[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [tab, setTab] = React.useState(0);
    const quizzesRow = quizzes?.map(quiz => createData(quiz.name, null))
    const multimediasRow = multimedias?.map(multimedia => createData(multimedia.name, multimedia.url))
    const history = useHistory();

    useEffect(() => {
        setMyAccount(props.account)
        if (props.lesson !== undefined) {
            setMultimedias(props.lesson.multimedias)
            setQuizzes(props.lesson.quizzes)
        }
    }, [props.lesson])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    };

    const TabPanel = (props: any) => {
        const { index, data } = props;

        return (
            <div
                role="tabpanel"
                hidden={tab !== index}
            >
                {tab === index && (
                    <DialogContent>
                        <TableContainer component={Paper} className={classes.container}>
                            <Table stickyHeader className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Name</StyledTableCell>
                                        {data[0]?.url && <StyledTableCell >URL</StyledTableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row: any) => (
                                        <StyledTableRow key={row.name}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.name}
                                            </StyledTableCell>
                                            {/* // @ts-ignore */}
                                            {row.url && <StyledTableCell><Link onClick={() => { window.open(row.url, "_blank") }}>{row.url}</Link></StyledTableCell>}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                )}
            </div>
        );
    }

    return (
        <>
            <div>
                <IconButton onClick={handleOpen}>
                    <InfoIcon />
                </IconButton>
                <Dialog open={open} onClose={handleClose} maxWidth={false} classes={{ paper : classes.dialogPaper}}>
                    <DialogTitle id="form-dialog-title">View Lesson Multimedia</DialogTitle>
                    <Tabs
                        value={tab}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleTabChange}
                        centered
                    >
                        <Tab label="Multimedia" />
                        <Tab label="Quizzes" />
                    </Tabs>
                    <div id="panel-group">
                        <TabPanel value={tab} index={0} data={multimediasRow}>
                        </TabPanel>

                        <TabPanel value={tab} index={1} data={quizzesRow}>
                        </TabPanel>
                    </div>
                    <DialogActions>
                        <Button onClick={handleClose} >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}

export default MultimediaModal;