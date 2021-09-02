import React, { useState } from "react";
import { Grid, TextField } from "@material-ui/core";
import { CourseBuilderCard, CourseBuilderCardHeader, CourseBuilderContainer, CourseBuilderContent } from "./CourseBuilderElements";
import { Button } from "@material-ui/core";
import LessonPlan from "./components/LessonPlan";
import ChipInput from 'material-ui-chip-input';


function CourseBuilderPage() {
    const [courseName, setCourseName] = useState<string>("");
    const [courseDescription, setCourseDescription] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [file, setFile] = useState<any>();
    const [tags, setTags] = useState<string[]>([]);

    const handleChipChange = (chips: string[]) => {
        setTags(chips)
    }

    return (
        <CourseBuilderContainer>
            <CourseBuilderCard id="course-information">
                <CourseBuilderCardHeader
                    title="Course Information"
                />
                <CourseBuilderContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField id="standard-basic" fullWidth required label="Name" value={courseName} onChange={e => setCourseName(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="standard-basic" fullWidth multiline maxRows={3} required label="Description" value={courseDescription} onChange={e => setCourseDescription(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <ChipInput fullWidth label="Tags" value={tags}
                                onChange={(chips) => handleChipChange(chips)}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <TextField id="standard-basic" fullWidth disabled value={fileName} label="Banner Image"></TextField>
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
                                        setFile(e.target.files[0])
                                        // @ts-ignore
                                        setFileName(e.target.files[0].name)
                                    }}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                </CourseBuilderContent>
            </CourseBuilderCard>
            <CourseBuilderCard id="lesson-plan">
                <LessonPlan/>
            </CourseBuilderCard>
        </CourseBuilderContainer>
    )
}

export default CourseBuilderPage;