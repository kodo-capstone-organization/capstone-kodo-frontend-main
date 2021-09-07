import React, { useState, useEffect, useReducer } from "react";
import { Grid, TextField } from "@material-ui/core";
import { CourseBuilderCard, CourseBuilderCardHeader, CourseBuilderContainer, CourseBuilderContent } from "./CourseBuilderElements";
import { Button } from "@material-ui/core";
import LessonPlan from "./components/LessonPlan";
import ChipInput from 'material-ui-chip-input';
import { getCourseByCourseId } from './../../apis/Course/CourseApis';
import { Tag } from "../../apis/Entities/Tag";

const formReducer = (state: any, event: any) => {
    return {
        ...state,
        [event.name]: event.value
    }
}

function CourseBuilderPage(props: any) {

    const courseId = props.match.params.courseId;

    const [loading, setLoading] = useState<boolean>(true);

    const [bannerImageFile, setBannerImageFile] = useState<any>();
    const [courseFormData, setCourseFormData] = useReducer(formReducer, {});
    
    useEffect(() => {
        getCourseByCourseId(courseId).then(receivedCourse => {
            Object.keys(receivedCourse).map((key, index) => {
                let wrapperEvent = {
                    target: {
                        name: key,
                        value: Object.values(receivedCourse)[index]
                    }
                }
                handleFormDataChange(wrapperEvent)
            })
            setLoading(false);   
            }
        );
      }, []);

    const handleChipInputChange = (newTagTitles: object) => {
        let wrapperEvent = {
            target: {
                name: "courseTags",
                value: newTagTitles
            }
        }
        return handleFormDataChange(wrapperEvent);
    }

    const handleFormDataChange = (event: any) => {
        console.log(event)
        setCourseFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    return !loading && (
        <CourseBuilderContainer>
            <CourseBuilderCard id="course-information">
                <CourseBuilderCardHeader
                    title="Course Information"
                />
                <CourseBuilderContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField id="standard-basic" fullWidth required label="Name" value={courseFormData.name} onChange={handleFormDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="standard-basic" fullWidth multiline maxRows={3} required label="Description" value={courseFormData.description} onChange={handleFormDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <ChipInput fullWidth label="Tags" defaultValue={courseFormData.courseTags.map((tag: Tag) => tag.title)} onChange={(newChips) => handleChipInputChange(newChips)}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <TextField id="standard-basic" fullWidth disabled value={courseFormData.bannerUrl} label="Banner Image"></TextField>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                variant="contained"
                                component="label"
                                >
                                Upload Banner
                                <input
                                    type="file"
                                    hidden
                                    onChange={e => {
                                        // @ts-ignore
                                        setBannerImageFile(e.target.files[0])
                                    }}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                </CourseBuilderContent>
            </CourseBuilderCard>
            <CourseBuilderCard id="lesson-plan">
                <LessonPlan lessons={courseFormData.lessons}setCourseFormData={setCourseFormData}/>
            </CourseBuilderCard>
        </CourseBuilderContainer>
    )
}

export default CourseBuilderPage;