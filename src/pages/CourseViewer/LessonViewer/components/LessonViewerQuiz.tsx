import { useState, useEffect } from "react";

import { Lesson } from "../../../../apis/Entities/Lesson";
import { EnrolledLesson } from "../../../../apis/Entities/EnrolledLesson";

import { 
    LessonViewerCardElement, 
    LessonViewerHeaderElement, 
    LessonViewerContentElement,
} from "../LessonViewerElements";

function LessonViewerQuiz(props: any) {

    const enrolledLesson: EnrolledLesson = props.enrolledLesson;

    const [lesson, setLesson] = useState<Lesson>();
    
    useEffect(() => {
        if (enrolledLesson != null)
        {
            setLesson(enrolledLesson.parentLesson);
        }
    }, [enrolledLesson]);

    return (      
        <>
            { (lesson) &&                
                <LessonViewerCardElement>
                    <LessonViewerHeaderElement title="Quiz"/>
                    <LessonViewerContentElement>
                    </LessonViewerContentElement>
                </LessonViewerCardElement>
            }          
        </>
    );
}

export default LessonViewerQuiz;