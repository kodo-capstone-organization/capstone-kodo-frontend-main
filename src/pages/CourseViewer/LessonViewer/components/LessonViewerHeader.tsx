import { useState, useEffect } from "react";

import Box from '@material-ui/core/Box';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { Course } from "../../../../apis/Entities/Course";
import { EnrolledContent } from "../../../../apis/Entities/EnrolledContent";
import { EnrolledCourse } from "../../../../apis/Entities/EnrolledCourse";
import { EnrolledLesson } from "../../../../apis/Entities/EnrolledLesson";
import { Lesson } from "../../../../apis/Entities/Lesson";

import { 
    CourseTitle,
    ExitLink,
    ExitWrapper,   
    LessonTitle,
    LessonViewerCardElement, 
    LessonViewerContentElement,
    LessonViewerHeaderElement, 
    LessonViewerProgress,
} from "../LessonViewerElements";

import { colours } from "../../../../values/Colours";


function LessonViewerHeader(props: any) {

    const enrolledCourse: EnrolledCourse = props.enrolledCourse;
    const enrolledLesson: EnrolledLesson = props.enrolledLesson;

    const [course, setCourse] = useState<Course>();
    const [lesson, setLesson] = useState<Lesson>();
    const [lessonCompletionPercentage, setLessonCompletionPercentage] = useState<number>(0);
    
    useEffect(() => {
        if (enrolledCourse != null)
        {
            setCourse(enrolledCourse.parentCourse);
        }
    }, [enrolledCourse]);

    useEffect(() => {
        if (enrolledLesson != null)
        {
            setLesson(enrolledLesson.parentLesson);
            setLessonCompletionPercentage(caculateLessonCompletionPercentage());            
        }
    }, [enrolledLesson]);
   
    const showBackToCourseOverviewIcon = () => {
        return (
            <ExitWrapper>
                <ExitLink to={`/overview/${enrolledCourse?.parentCourse.courseId}`}>
                    <Tooltip title={<div style={{ fontSize: "1.5em", padding: "2px" }}>Back to Course Overview</div>}>
                        <CancelOutlinedIcon fontSize="large" style={{ color: colours.BLUE2, padding: 20 }} />
                    </Tooltip>
                </ExitLink>
            </ExitWrapper>
        );
    }

    const showLessonProgress = () => {
        return (            
            <>                
                Completion Percentage:
                <LessonViewerProgress>
                    <LinearProgressWithLabel value={lessonCompletionPercentage} />
                </LessonViewerProgress>
            </>
        );
    }

    function caculateLessonCompletionPercentage(): number {
        var completedContents = 0;
        var totalContent = enrolledLesson.enrolledContents.length;

        enrolledLesson.enrolledContents.forEach((enrolledContent: EnrolledContent) => {
            if (enrolledContent.dateTimeOfCompletion) {                
                completedContents++;
            }
        });

        return (completedContents / totalContent) * 100;
    }

    function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2">{`${Math.round(
                    props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }

    return (      
        <>
            { showBackToCourseOverviewIcon() }            
            { (course && lesson) &&
                <LessonViewerCardElement>
                    <LessonViewerHeaderElement title="Lesson Overview"/>
                    <LessonViewerContentElement>
                        <LessonTitle>Week {lesson?.sequence}</LessonTitle>
                        <br/>
                        <CourseTitle>{course?.name}</CourseTitle>                        
                        { lesson.description }
                        <br/>
                        <br/>
                        { showLessonProgress() }
                    </LessonViewerContentElement>
                </LessonViewerCardElement>
            }          
        </>
    );
}

export default LessonViewerHeader;