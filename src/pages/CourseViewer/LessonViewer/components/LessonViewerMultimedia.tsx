import { useState, useEffect } from "react";

import { Content } from "../../../../apis/Entities/Content";
import { EnrolledContent } from "../../../../apis/Entities/EnrolledContent";
import { EnrolledCourse } from "../../../../apis/Entities/EnrolledCourse";
import { EnrolledLesson } from "../../../../apis/Entities/EnrolledLesson";
import { Multimedia } from "../../../../apis/Entities/Multimedia";

import { 
    CheckIcon,
    ContentLink,
    ContentMenu,
    Image,
    LessonViewerCardElement, 
    LessonViewerContentElement,
    LessonViewerHeaderElement, 
    PlayIcon,
    ReadingIcon,
    ZipIcon,
} from "../LessonViewerElements";


function LessonViewerMultimedia(props: any) {

    const enrolledCourse: EnrolledCourse = props.enrolledCourse;
    const enrolledLesson: EnrolledLesson = props.enrolledLesson;
    const enrolledContents: EnrolledContent[] = props.enrolledContents;

    const [enrolledCourseId, setEnrolledCourseId] = useState<number>(); 
    const [enrolledLessonId, setEnrolledLessonId] = useState<number>();

    useEffect(() => {
        if (enrolledCourse != null)
        {
            setEnrolledCourseId(enrolledCourse.enrolledCourseId);
        }
    }, [enrolledCourse]);

    useEffect(() => {
        if (enrolledLesson != null)
        {
            setEnrolledLessonId(enrolledLesson.enrolledLessonId);
        }
    }, [enrolledLesson]);

    function previousLessonCompleted(): boolean {
        let allEnrolledLessons = enrolledCourse?.enrolledLessons;
        if (allEnrolledLessons 
            && enrolledLesson 
            && enrolledLesson?.parentLesson.sequence > 1) {
            let sequence = enrolledLesson.parentLesson.sequence
            let pLesson = allEnrolledLessons[sequence - 2];
            if (pLesson.dateTimeOfCompletion !== null) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }

    function isCompleted(enrolledContent: EnrolledContent): boolean {
        return enrolledContent.dateTimeOfCompletion !== null;
    }

    function isMultimedia(content: Content): boolean {
        return content.type === "multimedia";
    }

    const showContentLink = (multimedia: Multimedia) => {
        return (
            <>
                {multimedia.multimediaType === "PDF" && <ReadingIcon />}
                {multimedia.multimediaType === "DOCUMENT" && <ReadingIcon />}
                {multimedia.multimediaType === "IMAGE" && <Image />}
                {multimedia.multimediaType === "VIDEO" && <PlayIcon />}
                {multimedia.multimediaType === "ZIP" && <ZipIcon />}
                {multimedia.multimediaType === "PDF" && "Reading: " + multimedia.name}
                {multimedia.multimediaType === "DOCUMENT" && "Reading: " + multimedia.name } 
                {multimedia.multimediaType === "IMAGE" && "Image: " + multimedia.name}
                {multimedia.multimediaType === "VIDEO" && "Video: " + multimedia.name }
                {multimedia.multimediaType === "ZIP" && "Zip: " + multimedia.name }  
            </>
        );
    }

    const showCompleted = (enrolledContent: EnrolledContent) => {
        return ( 
            isCompleted(enrolledContent) && <CheckIcon /> 
        );
    }

    return (      
        <>
            { (enrolledContents) &&  
                <LessonViewerCardElement>                    
                    <LessonViewerHeaderElement title="Multimedia"/>
                    <LessonViewerContentElement>
                        <ContentMenu>
                            { 
                                enrolledContents.map((enrolledContent: EnrolledContent) => {
                                    if (isMultimedia(enrolledContent.parentContent))
                                    {
                                        let multimedia: Multimedia = enrolledContent.parentContent as Multimedia;
                                        return (
                                            <ContentLink
                                                key={multimedia.contentId} 
                                                isCompleted={ isCompleted(enrolledContent) }
                                                previousCompleted={ previousLessonCompleted() }
                                                to={`/overview/lesson/${enrolledCourseId}/${enrolledLessonId}/${multimedia.contentId}`}
                                            >
                                                { showContentLink(multimedia) }
                                                { showCompleted(enrolledContent) }
                                            </ContentLink>   
                                        );
                                    }
                                })                              
                            }
                        </ContentMenu>
                    </LessonViewerContentElement>
                </LessonViewerCardElement>
            }
        </>
    );
}

export default LessonViewerMultimedia;