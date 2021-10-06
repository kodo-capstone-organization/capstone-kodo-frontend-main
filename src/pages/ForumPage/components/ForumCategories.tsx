import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import { getCourseByCourseId } from "../../../apis/Course/CourseApis";
import { getForumCategoryByCourseId, deleteForumCategory } from "../../../apis/Forum/ForumApis";
import { ForumCategory } from '../../../apis/Entities/ForumCategory';

import {
    ForumContainer, ForumCardHeader, ForumCardContent, ForumCard,
} from "./../ForumElements";
import {
    DataGrid,
    GridColDef,
    GridValueGetterParams
} from '@material-ui/data-grid';
// import { Button } from "../../../values/ButtonElements";
import {
    IconButton, Breadcrumbs, Link, Button
} from '@material-ui/core';

import ForumCategoryModal from './ForumCategoryModal';

function ForumPage(props: any) {

    const [courseId, setCourseId] = useState<number>();
    const [forumCategories, setForumCategories] = useState<ForumCategory[]>([]);
    const [isIndexPage, setIsIndexPage] = useState<Boolean>();
    // const [selectedQuestions, setSelectedQuestions] = useState<any>([]);
    const history = useHistory();

    useEffect(() => {
        getForumCategoryByCourseId(props.courseId).then((res) => {
            res.map((q) => {
                Object.assign(q, { id: q.forumCategoryId })
                return q;
            });
            setForumCategories(res);
        }).catch((err) => {
            console.log("Failed", err);
        })
    }, [props.courseId]);

    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', width: 90,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 400,
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 250,
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            width: 200,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <>
                        <Button primary>
                            View
                        </Button>
                        {
                            params.row != undefined &&
                            <ForumCategoryModal modalType={"EDIT"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} forumCategory={params.row}/>
                        }
                        <ForumCategoryModal modalType={"DELETE"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} forumCategory={params.row}/>
                    </>
                );
            }
        }
    ];

    const handleCallSnackbar = (snackbarObject: any) => {
        getForumCategoryByCourseId(props.courseId).then((res) => {
            res.map((q) => {
                Object.assign(q, { id: q.forumCategoryId })
                return q;
            });
            setForumCategories(res);
        }).catch((err) => {
            console.log("Failed", err);
        });
        props.onCallSnackbar(snackbarObject);
    }

    return (
            <ForumCard>
                <ForumCardHeader
                    title="Forum Discussion"
                    action={
                        <ForumCategoryModal modalType={"CREATE"} courseId={props.courseId} onForumCategoryChange={handleCallSnackbar} />
                    }
                />
                <ForumCardContent>
                    <div style={{ height: 400, width: '1000px' }}>
                        <DataGrid
                            rows={forumCategories}
                            columns={columns}
                            pageSize={5}
                            checkboxSelection
                            disableSelectionOnClick
                            onSelectionModelChange={(newSelection) => {
                                viewSelection(newSelection);
                            }}
                        />
                    </div>
                </ForumCardContent>
            </ForumCard>
    );
}

export default ForumPage