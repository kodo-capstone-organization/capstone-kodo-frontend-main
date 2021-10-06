import { useEffect, useState } from "react";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import TableRow from '@material-ui/core/TableRow';

import { EnrolledLessonWithStudentName } from "../../../../../apis/Entities/EnrolledLesson";

import { Row } from "./LessonStatisticsData";
import { Column } from "./LessonStatisticsData";
import { getRows } from "./LessonStatisticsData";
import { getColumns } from "./LessonStatisticsData";

import { 
    CheckIcon,
    CrossIcon,
    LessonStatisticsViewerCard,
    LessonStatisticsViewerCardContent,    
    LessonStatisticsViewerCardHeader,
} from "../../LessonStatisticsViewerElements";


function LessonStatisticsViewerTable(props: any) {

    const [enrolledLessons, setEnrolledLessons] = useState<EnrolledLessonWithStudentName[]>();
    const [rows, setRows] = useState<Row[]>();
    const [columns, setColumns] = useState<Column[]>();

    const [loading, setLoading] = useState<Boolean>(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        setLoading(true);
        setEnrolledLessons(props.enrolledLessons);
        setRows(getRows(props.enrolledLessons));
        setColumns(getColumns(props.enrolledLessons));
        setLoading(false);
    }, [props.enrolledLessons])

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

    const showBreakdown = () => {
        return (
            <>
            { (!loading && enrolledLessons && rows && columns && enrolledLessons.length > 0) &&                    
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
                            // return (
                            // <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                            //     {columns.map((column) => {
                            //     const value = row[column.id];
                            //     return (
                            //         <TableCell key={column.id} align={column.align}>
                            //         { column.id !== "progress" && 
                            //             <>
                            //             { value }
                            //             </>
                            //         }                                     
                            //         </TableCell>
                            //     );
                            //     })}
                            // </TableRow>
                            // );
                            return (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                                {row.data.map((data) => {
                                return (
                                    <TableCell align="center">
                                        { data === 'Y' ? <CheckIcon/> : data === '-' ? <CrossIcon/> : data }
                                    </TableCell>
                                );
                                })}
                            </TableRow>
                            );
                            return (
                                <>
                                </>
                            );
                        })
                    }
                    </TableBody>
                    <TableFooter>
                    <TableRow>
                        <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={columns.length}
                        count={rows.length}
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
            { (!enrolledLessons || enrolledLessons.length === 0) &&
                <>
                There are no students who are enrolled in this course!
                </>
            }
            </>
        )
    }

    return (
        <>
            <LessonStatisticsViewerCard>
                <LessonStatisticsViewerCardHeader title='Breakdown' />
                <LessonStatisticsViewerCardContent>
                    { showBreakdown() }
                    { showEmptyState() }
                </LessonStatisticsViewerCardContent>
            </LessonStatisticsViewerCard>
        </>
    );
}

export default LessonStatisticsViewerTable;