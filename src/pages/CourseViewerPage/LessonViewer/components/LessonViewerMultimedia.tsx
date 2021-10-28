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

    
    function isCompleted(enrolledContent: EnrolledContent): boolean {
        return enrolledContent.dateTimeOfCompletion !== null;
    }

    function isMultimedia(content: Content): boolean {
        // @ts-ignore
        return content.type === "multimedia";
    }


    const showMultimedias = (enrolledContents: EnrolledContent[]) => {
        return (
            enrolledContents.map((enrolledContent: EnrolledContent) => {
                if (isMultimedia(enrolledContent.parentContent))
                {
                    let multimedia: Multimedia = enrolledContent.parentContent as Multimedia;
                    return (
                        <ContentLink
                            key={multimedia.contentId} 
                            isCompleted={ isCompleted(enrolledContent) }
                            previousCompleted={ props.previousLessonCompleted() }                            
                            to={`/overview/course/${enrolledCourseId}/lesson/${enrolledLessonId}/multimedia/${enrolledContent.enrolledContentId}`}
                        >
                            { showContentLink(multimedia) }
                            { showCompleted(enrolledContent) }
                        </ContentLink>   
                    );
                }
            })      
        );
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
                    <LessonViewerHeaderElement title="Multimedias"/>
                    <LessonViewerContentElement>
                        <ContentMenu>
                            { showMultimedias(enrolledContents) }
                        </ContentMenu>
                    </LessonViewerContentElement>
                </LessonViewerCardElement>
            }
        </>
    );
}

export default LessonViewerMultimedia;