import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { Quiz } from '../../../apis/Entities/Quiz';
import { Lesson } from '../../../apis/Entities/Lesson';
import { useHistory } from "react-router-dom";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddIcon from '@material-ui/icons/Add';
import { Dialog, DialogContent, DialogContentText, DialogTitle, InputLabel, Input, FormControl, DialogActions, Grid, Chip} from '@material-ui/core';
import { Button } from "../../../values/ButtonElements";
import { createNewBasicQuiz, deleteQuizzes } from '../../../apis/Quiz/QuizApis';

interface IErrors<TValue> {
  [id: string]: TValue;
}
interface Data {
  id: number
  name: string,
  description: string,
  maxAttemptsPerStudent: number,
  timeLimit: string,
  contentId: number
}

function createData(
  id: number,
  name: string,
  description: string,
  maxAttemptsPerStudent: number,
  timeLimit: string,
  contentId: number
): Data {
  return { id, name, description, maxAttemptsPerStudent, timeLimit, contentId };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'description', numeric: true, disablePadding: false, label: 'Description' },
  { id: 'maxAttemptsPerStudent', numeric: true, disablePadding: false, label: 'Max Attempts per Student' },
  { id: 'timeLimit', numeric: true, disablePadding: false, label: 'Time Limit (HH:MM:SS)' },
  { id: 'contentId', numeric: true, disablePadding: false, label: '' }
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  isEnrollmentActive: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, isEnrollmentActive } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  headCells.map((headCell) => { 
    if (headCell.id === "contentId") {
      headCell.label = isEnrollmentActive ? 'View Quiz' : 'Edit Quiz'
    }
  })

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  selectedIds: number[];
  selectedLessonId: number;
  handleFormDataChange: any;
  lessons: Lesson[];
  setLessons: any;
  setSelectedIds: any;
  history: any;
  isEnrollmentActive: boolean;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedIds, selectedLessonId, handleFormDataChange, setLessons, lessons, setSelectedIds, isEnrollmentActive} = props;
  const [newQuizName, setNewQuizName] = useState<string>("");
  const [newQuizDescription, setNewQuizDescription] = useState<string>("");
  const [newQuizTimeLimitHours, setNewQuizTimeLimitHours] = useState<number>(0);
  const [newQuizTimeLimitMinutes, setNewQuizTimeLimitMinutes] = useState<number>(0);
  const [newQuizMaxAttempts, setNewQuizMaxAttempts] = useState<number>(0);
  var [errors, setErrors] = useState<IErrors<boolean>>({
    name: false,
    description: false,
  });

  const [showAddQuizDialog, setShowAddQuizDialog] = useState<boolean>(false); 

  const openDialog = () => {
    setShowAddQuizDialog(true);
  }

  const handleClose = () => {
    setShowAddQuizDialog(false);
  }

  // Update quizzes for a particular lesson from courseFormData
  const handleDeleteQuiz = () => {
    let quizIdsToDelete: number[] = []
    const updatedLessons = lessons.map((lesson: Lesson) => {
      if (lesson.lessonId === selectedLessonId) {
        const updatedQuizzes = lesson.quizzes.filter((quiz: Quiz, index: number) => {
          if (selectedIds.includes(index)) quizIdsToDelete.push(quiz.contentId)

          return !selectedIds.includes(index)
        })

        lesson.quizzes = updatedQuizzes
      }
      return lesson
    })

    // Delete all the selected quizzes
    deleteQuizzes(quizIdsToDelete).then((result) => {
      setLessons(updatedLessons)

      let wrapperEvent = {
        target: {
          name: "lessons",
          value: updatedLessons
        }
      }

      handleFormDataChange(wrapperEvent)
      setSelectedIds([])
      })
  }

  const handleValidation = () => {
    let formIsValid = true;
    errors = {};

    if (newQuizName === "") {
      formIsValid = false ;
      errors['name'] = true;
    }

    if (newQuizDescription === "") {
      formIsValid = false;
      errors['description'] = true;      
    }

    setErrors(errors);

    return formIsValid;
  }

  const handleClickBuildQuiz = () => {
    if (!handleValidation()) return
    
    const lessonId = lessons.filter((lesson: Lesson) => lesson.lessonId === selectedLessonId).pop()?.lessonId

    if (lessonId !== undefined) {
      createNewBasicQuiz(lessonId, newQuizName, newQuizDescription, newQuizTimeLimitHours, newQuizTimeLimitMinutes, newQuizMaxAttempts).then((newQuiz) => {
        console.log(newQuiz);
  
        props.history.push({ pathname: `/buildquiz/${newQuiz.contentId}`, state: { mode: 'UPDATE' } })
      })
    }
  }

  return (
    <>
        <Dialog 
        fullWidth
        open={showAddQuizDialog}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
            <DialogTitle>Add a new Quiz</DialogTitle>
            <DialogContent
              style={{height: '300px'}}>
              <DialogContentText>
                First, enter some basic details about the new quiz below.
              </DialogContentText>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="quiz-name">Quiz Name</InputLabel>
                <Input
                  error={errors['name']}
                  id="quiz-name"
                  name="name"
                  type="text"
                  autoFocus
                  fullWidth
                  value={newQuizName}
                  onChange={(e) => setNewQuizName(e.target.value)}
                />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="quiz-description">Description</InputLabel>
                  <Input
                    error={errors['description']}
                    id="quiz-description"
                    name="description"
                    type="text"
                    fullWidth
                    multiline
                    value={newQuizDescription}
                    onChange={(e) => setNewQuizDescription(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <InputLabel htmlFor="quiz-timelimit">Time Limit</InputLabel>
                      <Input
                      fullWidth
                      id="quiz-timelimit"
                      placeholder="Hours"
                      name="timelimit"
                      type="number"
                      value={newQuizTimeLimitHours}
                      onChange={(e) => {
                        let value = parseInt(e.target.value)

                        if (value > 24) value = 24
                        if (value < 0) value = 0

                        setNewQuizTimeLimitHours(value)
                      }}
                      inputProps={{ min: 0, max: 24 }}
                    />
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel htmlFor="quiz-timelimit">Time Limit</InputLabel>
                      <Input
                      fullWidth
                      id="quiz-timelimit"
                      placeholder="Minutes"
                      name="timelimit"
                      type="number"
                      value={newQuizTimeLimitMinutes}
                      onChange={(e) => {
                        let value = parseInt(e.target.value)

                        if (value > 59) value = 59
                        if (value < 0) value = 0

                        setNewQuizTimeLimitMinutes(value)
                      }}
                      inputProps={{ min: 0, max: 59 }}
                    />
                    </Grid>
                  </Grid>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="quiz-maxattempts">Max Attempts</InputLabel>
                  <Input
                    id="quiz-maxattempts"
                    name="description"
                    type="number"
                    fullWidth
                    value={newQuizMaxAttempts}
                    onChange={(e) => {
                        let value = parseInt(e.target.value)

                        if (value > 100) value = 100
                        if (value < 0) value = 0

                        setNewQuizMaxAttempts(value)
                    }}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                Cancel
              </Button>
              <Button primary onClick={handleClickBuildQuiz}>
                Build Quiz
              </Button>
            </DialogActions>
    </Dialog>
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="span">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="span">
          Quizzes
        </Typography>
      )}
      <Tooltip title="Add Quiz">
        <IconButton 
          disabled={isEnrollmentActive}
          aria-label="add" 
          onClick={openDialog}>
            <AddIcon />
        </IconButton>
        </Tooltip>
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton 
            disabled={isEnrollmentActive}
            aria-label="delete" 
            onClick={handleDeleteQuiz}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
    </>
  );
};

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
  }),
);

export default function QuizTable(props: any) {
    const handleFormDataChange = props.handleFormDataChange;
    const [quizzes, setQuizzes] = useState<Quiz[]>(props.quizzes);
    const [lessons, setLessons] = useState<Lesson[]>(props.lessons);
    const rows = quizzes?.length > 0 ? quizzes.map((row: Quiz, index: number) => createData(index, row.name, row.description, row.maxAttemptsPerStudent, row.timeLimit, row.contentId)) : []
    const history = useHistory();

    // Used to trigger rerendering of QuizTable whenever lessons is updated in Table Header component
    useEffect(() => {
      const newQuizzes = lessons.find((lesson: Lesson) => lesson.lessonId === props.selectedLessonId)?.quizzes
      if (newQuizzes) {
        setQuizzes(newQuizzes)
      }
    }, [lessons, props.selectedLessonId])

    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
          const newSelectedIds = rows.map((n: any) => n.id);
          setSelectedIds(newSelectedIds);
          return;
        }
        setSelectedIds([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selectedIds.indexOf(id);
        let newSelectedIds: number[] = [];

        if (selectedIndex === -1) {
          newSelectedIds = newSelectedIds.concat(selectedIds, id);
        } else if (selectedIndex === 0) {
          newSelectedIds = newSelectedIds.concat(selectedIds.slice(1));
        } else if (selectedIndex === selectedIds.length - 1) {
          newSelectedIds = newSelectedIds.concat(selectedIds.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelectedIds = newSelectedIds.concat(
            selectedIds.slice(0, selectedIndex),
            selectedIds.slice(selectedIndex + 1),
          );
        }

        setSelectedIds(newSelectedIds);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const navigateToQuizBuilder = (quizId: number) => {
      if (props.isEnrollmentActive) {
        history.push({ pathname: `/buildquiz/${quizId}`, state: { mode: 'VIEW' } })
      } else {
        history.push({ pathname: `/buildquiz/${quizId}`, state: { mode: 'EDIT' } })
      }
    }

    const isSelected = (index: number) => selectedIds.indexOf(index) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <>
        <div className={classes.root}>
        <Paper className={classes.paper}>
            <EnhancedTableToolbar 
                isEnrollmentActive={props.isEnrollmentActive}
                numSelected={selectedIds.length} 
                selectedIds={selectedIds}
                selectedLessonId={props.selectedLessonId}
                lessons={lessons}
                setLessons={setLessons}
                handleFormDataChange={handleFormDataChange}
                setSelectedIds={setSelectedIds}
                history={history}/>
            {rows.length > 0 &&
            <TableContainer>
            <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={'small'}
                aria-label="enhanced table"
            >
                <EnhancedTableHead
                isEnrollmentActive={props.isEnrollmentActive}
                classes={classes}
                numSelected={selectedIds.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                />
                <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                    // @ts-ignore
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                        <TableRow
                        hover
                        // @ts-ignore
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                        >
                        <TableCell padding="checkbox">
                            <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.description}</TableCell>
                        <TableCell align="right">{row.maxAttemptsPerStudent}</TableCell>
                        <TableCell align="right">{row.timeLimit}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="primary" onClick={() => navigateToQuizBuilder(row.contentId)}>
                              <NavigateNextIcon/>&nbsp;
                          </IconButton>
                        </TableCell>
                        </TableRow>
                    );
                    })}
                {emptyRows > 0 && (
                    <TableRow style={{ height: 33 * emptyRows }}>
                    <TableCell colSpan={6} />
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </TableContainer>}
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        </div>
        </>
    );
}
