import React, { useState, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { Box, Grid, TextField, InputLabel, Input, InputAdornment} from "@material-ui/core";
import { CourseBuilderCard, CourseBuilderCardHeader, CourseBuilderContainer, CourseBuilderContent } from "./CourseBuilderElements";
import { Button } from "@material-ui/core";
import LessonPlan from "./components/LessonPlan";
import ChipInput from 'material-ui-chip-input';
import { getCourseByCourseId, updateCourse } from './../../apis/Course/CourseApis';
import { Tag } from "../../apis/Entities/Tag";
import { Lesson } from "../../apis/Entities/Lesson";
import { Multimedia } from "../../apis/Entities/Multimedia"
import { UpdateCourseReq } from "../../apis/Entities/Course";

const formReducer = (state: any, event: any) => {
    return {
        ...state,
        [event.name]: event.value
    }
}

function CourseBuilderPage(props: any) {

    const history = useHistory();
    const courseId = props.match.params.courseId;

    const [loading, setLoading] = useState<boolean>(true);

    const [bannerImageFile, setBannerImageFile] = useState<File>(new File([""], ""));
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

    const handleBannerImageChange = (event: any) => {
        setBannerImageFile(event.target.files[0])

        let wrapperEvent = {
            target: {
                name: "bannerPictureFileName",
                value: event.target.files[0].name 
            }
        }
        handleFormDataChange(wrapperEvent)
    }

    const handleFormDataChange = (event: any) => {
        setCourseFormData({
            name: event.target.name,
            value: event.target.value,
        });
    }

    const buildUpdateCourseReq = (courseFormData: any) => {
        const updatedCourse = {
            name: courseFormData.name,
            description: courseFormData.description,
            price: courseFormData.price,
            courseId: courseFormData.courseId,
        }

        const updatedCourseTagTitles = courseFormData.courseTags.map((tag: Tag) => { return tag.title })

        const updatedLessonReqs = courseFormData.lessons.map((lesson: Lesson) => {
            return {
                lesson: lesson,
                quizzes: lesson.quizzes,
                multimediaReqs: lesson.multimedias.map((multimedia: Multimedia) => {
                    return {
                        multimedia: multimedia,
                        multipartFile: multimedia.file
                    }
                })
            }
        })

        // @ts-ignore
        const updateCourseReq: UpdateCourseReq = { course: updatedCourse, courseTagTitles: updatedCourseTagTitles, updateLessonReqs: updatedLessonReqs }
        return updateCourseReq
    }

    const handleUpdateCourse = () => {
        const updateCourseReq = buildUpdateCourseReq(courseFormData)

        updateCourse(updateCourseReq, bannerImageFile).then((updatedCourse) => {
            console.log(updatedCourse);

            setCourseFormData(updatedCourse)
        })
    }

    const navigateToPreviousPage = () => {
        history.goBack();
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
                            <TextField id="standard-basic" fullWidth label="Name" name="name" value={courseFormData.name} onChange={handleFormDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="standard-basic" fullWidth multiline maxRows={3} name="description" label="Description" value={courseFormData.description} onChange={handleFormDataChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                id="start-adornment"
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                value={courseFormData.price}
                                onChange={handleFormDataChange}
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <ChipInput fullWidth label="Tags" defaultValue={courseFormData.courseTags.map((tag: Tag) => tag.title)} onChange={(newChips) => handleChipInputChange(newChips)}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField id="standard-basic" fullWidth disabled value={courseFormData.bannerPictureFileName} label="Banner Image"></TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                component="label"
                                >
                                Upload Banner
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleBannerImageChange}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                </CourseBuilderContent>
            </CourseBuilderCard>
            <CourseBuilderCard id="lesson-plan">
                <LessonPlan courseFormData={courseFormData} lessons={courseFormData.lessons} handleFormDataChange={handleFormDataChange}/>
            </CourseBuilderCard>
            <Grid container spacing={3} justify="flex-end">
                <Box m={1} pt={2}>
                    <Button
                        variant="contained"
                        component="label"
                        onClick={navigateToPreviousPage}>
                        Cancel
                    </Button>
                </Box>
                <Box m={1} pt={2}>
                    <Button
                        variant="contained"
                        component="label"
                        onClick={handleUpdateCourse}>
                        Update Course
                    </Button>
                </Box>
            </Grid>
        </CourseBuilderContainer>
    )
}

export default CourseBuilderPage;