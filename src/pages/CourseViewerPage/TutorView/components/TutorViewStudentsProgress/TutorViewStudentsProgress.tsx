import { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import TableRow from '@material-ui/core/TableRow';
import Typography from "@material-ui/core/Typography";
import LinearProgress, {
  LinearProgressProps
} from "@material-ui/core/LinearProgress";


import { Course } from "../../../../../entities/Course";
import { EnrolledCourseWithStudentResp } from "../../../../../entities/EnrolledCourse";

import { getEnrolledCoursesWithStudentCompletion } from "../../../../../apis/EnrolledCourseApis";

import {
  TutorViewCard,
  TutorViewCardContent,
  TutorViewCardHeader,
} from "../../TutorViewElements";

import {
  Row,
  Column,
  getColumns,
  getRows,
} from "./StudentProgressData"

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={150}>
        <Typography variant="body2" color="textSecondary">
          {
            `${Math.round(props.value)}%`
          }
        </Typography>
      </Box>
    </Box>
  );
}

function TutorViewStudentsProgress(props: any) {

    const course: Course = props.course;
    const columns: Column[] = getColumns();

    const [enrolledStudentsAndCompletion, setEnrolledStudentsAndCompletion] = useState<EnrolledCourseWithStudentResp[]>();
    const [loading, setLoading] = useState<Boolean>(true);

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState<Row[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
      setLoading(true)
      getEnrolledCoursesWithStudentCompletion(course.courseId).then((receivedList: EnrolledCourseWithStudentResp[]) => {
        setEnrolledStudentsAndCompletion(receivedList);
        setRows(getRows(receivedList));
        setLoading(false)
      });
    }, [course]);

    const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const showStudentProgress = () => {
      return (
        <>
          { (!loading && enrolledStudentsAndCompletion && enrolledStudentsAndCompletion?.length > 0) &&                    
            <TableContainer style={{ maxHeight: "30em" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    { 
                      columns.map((column: Column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  { column.id !== "progress" && 
                                    <>
                                      { value }
                                    </>
                                  }
                                  { column.label === "Progress" && typeof value === "number" &&
                                    <LinearProgressWithLabel
                                      value={value * 100}
                                    />
                                  }                                           
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })
                  }
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={columns.length}
                      count={enrolledStudentsAndCompletion?.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          'aria-label': 'rows per page',
                        },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>    
          }
        </>
      );
    }

    const showEmptyState = () => {
      return (
        <>
          { (!enrolledStudentsAndCompletion || enrolledStudentsAndCompletion?.length === 0) &&
            <>
              There are no students who are enrolled in this course!
            </>
          }
        </>
      )
    }
  
    return (
        <>
          <TutorViewCard>
            <TutorViewCardHeader title="Students Progress"/>
              <TutorViewCardContent>
                { showStudentProgress() }
                { showEmptyState() }
            </TutorViewCardContent>
          </TutorViewCard>
        </>
    );
}

export default TutorViewStudentsProgress;