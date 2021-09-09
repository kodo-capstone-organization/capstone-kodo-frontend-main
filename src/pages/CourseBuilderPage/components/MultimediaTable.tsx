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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { Multimedia, MultimediaType } from '../../../apis/Entities/Multimedia';
import { Lesson } from '../../../apis/Entities/Lesson';
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, InputLabel, Input, FormControl, Grid, DialogActions} from '@material-ui/core';
import { ACCEPTABLE_FILE_TYPE, getFileType } from '../../../utils/GetFileType';

interface Data {
  id: number,
  name: string,
  description: string,
  type: string,
  urlFilename: string
}

function createData(
  id: number,
  name: string,
  description: string,
  type: string,
  urlFilename: string
): Data {
  return { id, name, description, type, urlFilename };
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
  { id: 'type', numeric: true, disablePadding: false, label: 'File Type' },
  { id: 'urlFilename', numeric: true, disablePadding: false, label: 'File Name' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

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
      '& > *': {
        margin: theme.spacing(1),
      },
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    input: {
      display: 'none',
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
  lessonIndex: number;
  handleFormDataChange: any;
  lessons: Lesson[];
  setLessons: any;
  setSelectedIds: any;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedIds, lessonIndex, handleFormDataChange, setLessons, lessons, setSelectedIds } = props;
  const [newFile, setNewFile] = useState<Multimedia>({ contentId: -1, name: "", description: "", url: "", type: MultimediaType.EMPTY, urlFilename: "", file: new File([""], "")}, );

  const [showAddMultimediaDialog, setShowAddMultimediaDialog] = useState<boolean>(false); 

  const openDialog = () => {
    setShowAddMultimediaDialog(true);
  }

  const handleClose = () => {
    setShowAddMultimediaDialog(false);
  }

  const handleClickSubmit = () => {
    const updatedLessons = lessons.map((lesson: Lesson, index: number) => {
      if (index === lessonIndex) {
        const updatedMultimedias = lesson.multimedias.concat(newFile)
        lesson.multimedias = updatedMultimedias
      }
      return lesson
    })

    setLessons(updatedLessons)

    let wrapperEvent = {
      target: {
        name: "lessons",
        value: updatedLessons
      }
    }

    handleFormDataChange(wrapperEvent)
    setShowAddMultimediaDialog(false)
  }

  const handleFileChange = (event: any) => {
    let updatedFile = newFile

    switch (event.target.name) {
      case "name":
        updatedFile.name = event.target.value
        break;
      case "description":
        updatedFile.description = event.target.value
        break;
      case "file":
        updatedFile.urlFilename = event.target.files[0].name
        updatedFile.file = event.target.files[0]
        updatedFile.type = getFileType(updatedFile.urlFilename)
        break;
    }
    setNewFile({...updatedFile})
  }

  // Update multimedias for a particular lesson from courseFormData
  const handleDeleteMultimedia = () => {
    const updatedLessons = lessons.map((lesson: Lesson, lessonIdx: number) => {
      if (lessonIdx === lessonIndex) {
        const updatedMultimedias = lesson.multimedias.filter((multimedia: Multimedia, multimediaIdx: number) => !selectedIds.includes(multimediaIdx))
        lesson.multimedias = updatedMultimedias
      }
      return lesson
    })

    setLessons(updatedLessons)

    let wrapperEvent = {
      target: {
        name: "lessons",
        value: updatedLessons
      }
    }

    setSelectedIds([])
    handleFormDataChange(wrapperEvent)
  }

  return (
    <>
    <Dialog 
        fullWidth
        open={showAddMultimediaDialog}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
            <DialogTitle>Add a new Multimedia</DialogTitle>
            <DialogContent
              style={{height: '300px'}}>
              <DialogContentText>
                First, enter some basic details about the new multimedia below.
              </DialogContentText>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="multimedia-name">Multimedia Name</InputLabel>
                <Input
                  id="multimedia-name"
                  name="name"
                  type="text"
                  autoFocus
                  fullWidth
                  value={newFile.name}
                  onChange={handleFileChange}
                />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="multimedia-description">Description</InputLabel>
                  <Input
                    id="multimedia-description"
                    name="description"
                    type="text"
                    autoFocus
                    fullWidth
                    value={newFile.description}
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <input 
                    accept={ACCEPTABLE_FILE_TYPE}
                    className={classes.input} 
                    id="contained-button-file" 
                    type="file" 
                    name="file"
                    onChange={handleFileChange} />
                  <InputLabel htmlFor="contained-button-file">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      aria-label="upload picture" 
                      component="span">
                        Upload
                    </Button>
                  </InputLabel>
                </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleClickSubmit}>
                Add Multimedia
              </Button>
            </DialogActions>
    </Dialog>
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Multimedias
        </Typography>
      )}
      <Tooltip title="Add Multimedia">
        <IconButton 
          aria-label="add" 
          onClick={openDialog}>
            <AddIcon />
        </IconButton>
        </Tooltip>
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={handleDeleteMultimedia}>
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

export default function MultimediaTable(props: any) {
    const handleFormDataChange = props.handleFormDataChange;
    const [multimedias, setMultimedias] = useState<Multimedia[]>(props.multimedias);
    const [lessons, setLessons] = useState<Lesson[]>(props.lessons);
    const rows = multimedias?.length > 0 ? multimedias.map((row: Multimedia, index: number) => createData(index, row.name, row.description, row.type, row.urlFilename)) : []

    // Used to trigger rerendering of MultimediaTable whenever lessons is updated in Table Header component
    useEffect(() => {
      const newMultimedias = lessons.find((lesson) => lesson.lessonId === props.lessonId)?.multimedias
      if (newMultimedias) {
        setMultimedias(newMultimedias)
      }
    }, [lessons])

    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
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

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (index: number) => selectedIds.indexOf(index) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <>
        <div className={classes.root}>
        <Paper className={classes.paper}>
            <EnhancedTableToolbar 
                numSelected={selectedIds.length}
                selectedIds={selectedIds}
                lessonIndex={props.lessonIndex}
                lessons={lessons}
                setLessons={setLessons}
                handleFormDataChange={handleFormDataChange}
                setSelectedIds={setSelectedIds} />
            {rows.length > 0 &&
            <TableContainer>
            <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
            >
                <EnhancedTableHead
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
                        <TableCell align="right">{row.type}</TableCell>
                        <TableCell align="right">{row.urlFilename}</TableCell>
                        </TableRow>
                    );
                    })}
                {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
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
        <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
        />
        </div>
        </>
    );
}
