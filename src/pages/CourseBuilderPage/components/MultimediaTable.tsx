import React, { useState, useEffect } from 'react';

import clsx from 'clsx';

import { 
  Theme,
  createStyles, 
  lighten, 
  makeStyles
} from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { 
  Dialog, 
  DialogActions,
  DialogContent,
  DialogContentText, 
  DialogTitle, 
  FormControl, 
  Input, 
  InputLabel, 
} from '@material-ui/core';

import { 
  Multimedia, 
  MultimediaType 
} from '../../../apis/Entities/Multimedia';

import { Lesson } from '../../../apis/Entities/Lesson';
import { 
  addNewMultimediaToLesson,   
  deleteMultimediasFromLesson,
  updateMultimedia 
} from '../../../apis/Multimedia/MultimediaApis';

import { 
  ACCEPTABLE_FILE_TYPE, 
  getFileType 
} from '../../../utils/GetFileType';

import { Button } from "../../../values/ButtonElements";

import {
  VideoCard,
  PDFCard,
  DocumentCard,
  ImageCard,
} from "./../../CourseViewer/MultimediaViewer/MultimediaViewerElements";

import ReactPlayer from "react-player";
import PDFViewer from "./../../CourseViewer/MultimediaViewer/PDFViewer";

interface IErrors<TValue> {
  [id: string]: TValue;
}
interface Data {
  id: number,
  name: string,
  description: string,
  type: string,
  urlFilename: string,
  contentId: number,
  url: string
}

function createData(
  id: number,
  name: string,
  description: string,
  type: string,
  urlFilename: string,
  contentId: number,
  url: string
): Data {
  return { id, name, description, type, urlFilename, contentId, url };
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
  { id: 'contentId', numeric: true, disablePadding: false, label: 'Preview Multimedia' },
  { id: 'contentId', numeric: true, disablePadding: false, label: 'Update Multimedia' },
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
  selectedLessonId: number;
  handleFormDataChange: any;
  lessons: Lesson[];
  setLessons: any;
  setSelectedIds: any;
  isEnrollmentActive: boolean;
  callOpenSnackBar: any;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedIds, selectedLessonId, handleFormDataChange, setLessons, lessons, setSelectedIds, isEnrollmentActive } = props;
  const [newFile, setNewFile] = useState<Multimedia>({ contentId: -1, name: "", description: "", url: "", multimediaType: MultimediaType.EMPTY, urlFilename: "", file: new File([""], ""), type: "multimedia"});
  const [validationErrorMessage, setValidationErrorMessage] = useState<string>("");
  var [errors, setErrors] = useState<IErrors<boolean>>({
    name: false,
    description: false,
    file: false,
  });

  const [showAddMultimediaDialog, setShowAddMultimediaDialog] = useState<boolean>(false); 

  const openDialog = () => {
    setShowAddMultimediaDialog(true);
  }

  const handleClose = () => {
    setShowAddMultimediaDialog(false);
    setErrors({})
    setValidationErrorMessage("")
  }

  const handleValidation = () => {
    let formIsValid = true;
    let newValidationErrorMessage = "";
    errors = {};

    if (newFile.name === "") {
      formIsValid = false;
      errors['name'] = true;
      newValidationErrorMessage = newValidationErrorMessage.concat("Name cannot be empty. \n")
    }

    if (newFile.description === "") {
      formIsValid = false;
      errors['description'] = true;      
      newValidationErrorMessage = newValidationErrorMessage.concat("Description cannot be empty. \n")
    }

    if (!newFile.file || newFile.file.size === 0) {
      formIsValid = false;
      errors['file'] = true;
      newValidationErrorMessage = newValidationErrorMessage.concat("File cannot be empty. \n")
    }

    // Check whether file size larger than 200MB
    if (newFile.file && newFile.file.size > 200000000) {
      formIsValid = false;  
      newValidationErrorMessage = newValidationErrorMessage.concat("File size cannot be larger than 200MB. \n")
    }

    setErrors(errors);
    setValidationErrorMessage(newValidationErrorMessage)

    return formIsValid;
  }

  const handleClickAddMultimedia = () => {
    if (!handleValidation()) return

    const currentLessonId = lessons.filter((lesson: Lesson) => lesson.lessonId === selectedLessonId).pop()?.lessonId

    if (currentLessonId !== undefined && newFile.file !== undefined) {
      addNewMultimediaToLesson(currentLessonId, newFile.name, newFile.description, newFile.file)
          .then((newMultimedia) => {
            props.callOpenSnackBar("Multimedia successfully added", "success")

            const updatedLessons = lessons.map((lesson: Lesson) => {
              if (lesson.lessonId === selectedLessonId) {
                const updatedMultimedias = lesson.multimedias.concat(newMultimedia)
                lesson.multimedias = updatedMultimedias
              }
              return lesson
            })

            let wrapperEvent = {
              target: {
                name: "lessons",
                value: updatedLessons
              }
            }

            handleFormDataChange(wrapperEvent)

            setLessons(updatedLessons)

            handleClose()
            setNewFile({ contentId: -1, name: "", description: "", url: "", multimediaType: MultimediaType.EMPTY, urlFilename: "", file: new File([""], ""), type: "multimedia"})
          })
          .catch((error) => {
            props.callOpenSnackBar(`Error in adding multimedia: ${error}`, "error")
          })
    }
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
        // User didn't select any file by clicking cancel button
        if (event.target.files.length === 0) return

        updatedFile.newFilename = event.target.files[0].name
        updatedFile.file = event.target.files[0]

        if (updatedFile.newFilename !== undefined) {
          updatedFile.multimediaType = getFileType(updatedFile.newFilename)
        }
    
        break;
    }
    setNewFile({...updatedFile})
  }

  // Update multimedias for a particular lesson from courseFormData
  const handleDeleteMultimedia = () => {
    let multimediaIdsToDelete: number[] = []

    const updatedLessons = lessons.map((lesson: Lesson) => {
      if (lesson.lessonId === selectedLessonId) {
        const updatedMultimedias = lesson.multimedias.filter((multimedia: Multimedia, multimediaIdx: number) => {
          if (selectedIds.includes(multimediaIdx)) multimediaIdsToDelete.push(multimedia.contentId)
          
          return !selectedIds.includes(multimediaIdx)
        })
        
        lesson.multimedias = updatedMultimedias
      }
      return lesson
    })

    deleteMultimediasFromLesson(selectedLessonId, multimediaIdsToDelete)
        .then((result) => {
          if (result) {
            props.callOpenSnackBar("Multimedia successfully deleted", "success")
            setLessons(updatedLessons)

            let wrapperEvent = {
               target: {
                name: "lessons",
                value: updatedLessons
              }
            }

            setSelectedIds([])
            handleFormDataChange(wrapperEvent)
          } else {
            // some backend issue, but still managed to remove
            props.callOpenSnackBar("Multimedia removed from lesson", "info")
          }
        })
        .catch((error) => {
          props.callOpenSnackBar(`Error in deleting multimedia: ${error}`, "error")
        })
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
              style={{height: '50vh'}}>
              <DialogContentText>
                First, enter some basic details about the new multimedia below. <br/> Note: The allowed file size is 200MB.
              </DialogContentText>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="multimedia-name">Multimedia Name</InputLabel>
                <Input
                  error={errors['name']}
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
                    error={errors['description']}
                    id="multimedia-description"
                    name="description"
                    type="text"
                    fullWidth
                    multiline
                    value={newFile.description}
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="multimedia-type">File Type</InputLabel>
                  <Input
                    id="multimedia-type"
                    name="type"
                    type="text"
                    fullWidth
                    value={getFileType(newFile.file?.name === undefined ? "" : newFile.file.name)}
                    disabled
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="multimedia-filename">File</InputLabel>
                  <Input
                    error={errors['file']}
                    id="multimedia-filename"
                    name="filename"
                    type="text"
                    fullWidth
                    value={newFile.file?.name}
                    disabled
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
              <Button
                onClick={handleClose}>
                Cancel
              </Button>
              <Button primary onClick={handleClickAddMultimedia}>
                Add Multimedia
              </Button>
            </DialogActions>
            <DialogContent>
              {validationErrorMessage && <Alert severity="error">{validationErrorMessage}</Alert>}
            </DialogContent>
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
            onClick={handleDeleteMultimedia}>
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
    input: {
      display: 'none',
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
    const rows = multimedias?.length > 0 ? multimedias.map((row: Multimedia, index: number) => createData(index, row.name, row.description, row.multimediaType, row.urlFilename, row.contentId, row.url)) : []

    const [selectedPreviewFile, setSelectedPreviewFile] = useState<Data>();
    const [selectedMultimediaId, setSelectedMultimediaId] = useState<number>(0);
    const [newFile, setNewFile] = useState<Multimedia>({ contentId: -1, name: "", description: "", url: "", multimediaType: MultimediaType.EMPTY, urlFilename: "", file: new File([""], ""), type: "multimedia"});
    const [validationErrorMessage, setValidationErrorMessage] = useState<string>("");
    var [errors, setErrors] = useState<IErrors<boolean>>({
      name: false,
      description: false,
    });

    const [showUpdateMultimediaDialog, setShowUpdateMultimediaDialog] = useState<boolean>(false); 
    const [showPreviewMultimediaDialog, setShowPreviewMultimediaDialog] = useState<boolean>(false); 
  
    const openUpdateMultimediaDialog = () => {
      setShowUpdateMultimediaDialog(true);
    }

    const openPreviewMultimediaDialog = () => {
      setShowPreviewMultimediaDialog(true);
    }
  
    const handleCloseUpdateMultimediaDialog = () => {
      setSelectedMultimediaId(0)
      setShowUpdateMultimediaDialog(false);
      setErrors({})
      setValidationErrorMessage("");
      setNewFile({ contentId: -1, name: "", description: "", url: "", multimediaType: MultimediaType.EMPTY, urlFilename: "", file: new File([""], ""), type: "multimedia"})
    }

    const handleClosePreviewMultimediaDialog = () => {
      setShowPreviewMultimediaDialog(false);
    }

    const handleValidation = () => {
      let formIsValid = true;
      let newValidationErrorMessage = "";
      errors = {};
  
      if (newFile.name === "") {
        formIsValid = false ;
        errors['name'] = true;
        newValidationErrorMessage = newValidationErrorMessage.concat("Name cannot be empty. \n")
      }
  
      if (newFile.description === "") {
        formIsValid = false;
        errors['description'] = true;      
        newValidationErrorMessage = newValidationErrorMessage.concat("Description cannot be empty. \n")
      }

      // Check whether file size larger than 200MB
      if (newFile.file && newFile.file.size > 200000000) {
        formIsValid = false;  
        newValidationErrorMessage = newValidationErrorMessage.concat("File size cannot be larger than 200MB. \n")
      }
  
      setErrors(errors);
      setValidationErrorMessage(newValidationErrorMessage)
  
      return formIsValid;
    }
  
    const handleClickUpdateMultimedia = () => {
      if (!handleValidation()) return

      if (newFile.file !== undefined) {
        updateMultimedia(selectedMultimediaId, newFile.name, newFile.description, newFile.file)
            .then((newMultimedia) => {
              props.callOpenSnackBar("Multimedia successfully updated", "success")
              const updatedLessons = lessons.map((lesson: Lesson) => {
                if (lesson.lessonId === props.selectedLessonId) {
                  lesson.multimedias = lesson.multimedias.map((multimedia: Multimedia) => {
                    if (multimedia.contentId === newMultimedia.contentId) {
                      multimedia = newMultimedia
                    }
                    return multimedia
                  })
                }
                return lesson
              })

              let wrapperEvent = {
                target: {
                  name: "lessons",
                  value: updatedLessons
                }
              }

              handleFormDataChange(wrapperEvent)
              setLessons(updatedLessons)
              handleCloseUpdateMultimediaDialog()
              setNewFile({ contentId: -1, name: "", description: "", url: "", multimediaType: MultimediaType.EMPTY, urlFilename: "", file: new File([""], ""), type: "multimedia"})
            })
            .catch((error) => {
              props.callOpenSnackBar(`Error in updating multimedia: ${error}`, "error")
            })
      }
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
          // User didn't select any file by clicking cancel button
          if (event.target.files.length === 0) return

          updatedFile.newFilename = event.target.files[0].name
          updatedFile.file = event.target.files[0]
  
          if (updatedFile.newFilename !== undefined) {
            updatedFile.multimediaType = getFileType(updatedFile.newFilename)
          }
      
          break;
      }
      setNewFile({...updatedFile})
    }

    const handleOpenPreviewMultimediaDialog = (selectedContent: Data) => {
      setSelectedPreviewFile(selectedContent)

      openPreviewMultimediaDialog()
    }

    const handleOpenUpdateMultimediaDialog = (selectedContentId: number) => {
      setSelectedMultimediaId(selectedContentId)

      let fileToUpdate = newFile

      lessons.forEach((lesson: Lesson) => {
        if (lesson.lessonId === props.selectedLessonId) {
          lesson.multimedias.forEach((multimedia: Multimedia) => {
            if (multimedia.contentId === selectedContentId) {
              fileToUpdate.name = multimedia.name
              fileToUpdate.description = multimedia.description
              fileToUpdate.urlFilename = multimedia.urlFilename
              fileToUpdate.multimediaType = multimedia.multimediaType
            }
          })
        }
      })

      setNewFile(fileToUpdate)

      openUpdateMultimediaDialog()
    }

    // Used to trigger rerendering of MultimediaTable whenever lessons is updated in Table Header component
    useEffect(() => {
      const newMultimedias = lessons.find((lesson: Lesson) => lesson.lessonId === props.selectedLessonId)?.multimedias
      if (newMultimedias) {
        setMultimedias(newMultimedias)
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

    const isSelected = (index: number) => selectedIds.indexOf(index) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    function getUrlForDocument(urlFilename: string) {
      return `https://docs.google.com/gview?url=https://storage.googleapis.com/capstone-kodo-bucket/${urlFilename}&embedded=true`
    }

    return (
        <>
        <Dialog 
          fullWidth
          open={showPreviewMultimediaDialog}
          onClose={handleClosePreviewMultimediaDialog}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
            <DialogTitle>Multimedia Preview</DialogTitle>
            <DialogContent
              style={{height: '50vh'}}>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="multimedia-name">Multimedia Name</InputLabel>
                <Input
                  id="multimedia-name"
                  name="name"
                  type="text"
                  autoFocus
                  fullWidth
                  value={selectedPreviewFile?.name}
                  disabled
                />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="multimedia-description">Description</InputLabel>
                  <Input
                    id="multimedia-description"
                    name="description"
                    type="text"
                    fullWidth
                    multiline
                    value={selectedPreviewFile?.description}
                    disabled
                  />
                </FormControl>

                {selectedPreviewFile?.type === "VIDEO" &&
                  <VideoCard>
                    <ReactPlayer
                      url={selectedPreviewFile?.url}
                      controls={true}
                    />
                  </VideoCard>
                }

                {selectedPreviewFile?.type === "PDF" &&
                  <PDFCard>
                    <PDFViewer doc={selectedPreviewFile?.url} />
                  </PDFCard>
                }

                {selectedPreviewFile?.type === "IMAGE" &&
                  <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }} >
                    <ImageCard>
                      <img
                        src={selectedPreviewFile?.url}
                        width="600"
                      />
                    </ImageCard>
                  </div>
                }

                {selectedPreviewFile?.type === "DOCUMENT" &&
                  <DocumentCard>
                    <iframe title="docx-view" width="560" height="780" src={getUrlForDocument(selectedPreviewFile.urlFilename)}>
                    </iframe>
                  </DocumentCard>
                }
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePreviewMultimediaDialog}>
                Close
              </Button>
            </DialogActions>
        </Dialog>
        <Dialog 
          fullWidth
          open={showUpdateMultimediaDialog}
          onClose={handleCloseUpdateMultimediaDialog}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
            <DialogTitle>Update an existing Multimedia</DialogTitle>
            <DialogContent
              style={{height: '50vh'}}>
              <DialogContentText>
                Note: The allowed file size is 200MB.
              </DialogContentText>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="multimedia-name">Multimedia Name</InputLabel>
                <Input
                  error={errors['name']}
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
                    error={errors['description']}
                    id="multimedia-description"
                    name="description"
                    type="text"
                    fullWidth
                    multiline
                    value={newFile.description}
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="multimedia-type">File Type</InputLabel>
                  <Input
                    id="multimedia-type"
                    name="type"
                    type="text"
                    fullWidth
                    value={newFile.multimediaType}
                    disabled
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="multimedia-filename">File Name</InputLabel>
                  <Input
                    id="multimedia-filename"
                    name="filename"
                    type="text"
                    fullWidth
                    value={newFile.file?.size !== 0 ? newFile.newFilename : newFile.urlFilename}
                    disabled
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
              <Button onClick={handleCloseUpdateMultimediaDialog}>
                Cancel
              </Button>
              <Button primary onClick={handleClickUpdateMultimedia}>
                Update Multimedia
              </Button>
            </DialogActions>
            <DialogContent>
              {validationErrorMessage && <Alert severity="error">{validationErrorMessage}</Alert>}
            </DialogContent>
        </Dialog>
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
                callOpenSnackBar={props.callOpenSnackBar}
            />
            {rows.length > 0 &&
            <TableContainer>
              <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size={'small'}
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
                        <TableCell align="right">
                          <IconButton 
                            disabled={row.type === "ZIP"}
                            size="small" 
                            color="primary" 
                            onClick={() => {handleOpenPreviewMultimediaDialog(row)}}>
                              <VisibilityIcon/>&nbsp;
                          </IconButton>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            disabled={props.isEnrollmentActive} 
                            size="small" 
                            color="primary" 
                            onClick={() => {handleOpenUpdateMultimediaDialog(row.contentId)}}>
                              <EditIcon/>&nbsp;
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
