import { useEffect, useState } from "react";

import { Lesson } from "../../../../apis/Entities/Lesson";
import { EnrolledLessonWithStudentName } from "../../../../apis/Entities/EnrolledLesson";

import { 
    LessonStatisticsViewerCard,
    LessonStatisticsViewerCardHeader,
    LessonStatisticsViewerCardContent,
    LessonStatisticsViewerText,
    LessonStatisticsViewerColumn
} from "../LessonStatisticsViewerElements";

function LessonStatisticsViewerHeader(props: any) {

    const [lesson, setLesson] = useState<Lesson>();
    const [enrolledLessons, setEnrolledLessons] = useState<EnrolledLessonWithStudentName[]>();

    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        setLoading(true);
        setLesson(props.lesson);
        setEnrolledLessons(props.enrolledLessons);
        setLoading(false);
    }, [props.lesson, props.enrolledLessons])

    const showTotalNumberOfCompletedLessons = () => {
        let completedLessons = 0;
        
        if (enrolledLessons)
        {
            enrolledLessons.forEach((enrolledLessonWithStudentName: EnrolledLessonWithStudentName) => {
                if (enrolledLessonWithStudentName.enrolledLesson.dateTimeOfCompletion)
                {
                    completedLessons++;
                }
            })
        }

        return (
            <>
                { enrolledLessons &&
                    <LessonStatisticsViewerText>
                        Total Number of Students Who Completed Lesson: {completedLessons} / {enrolledLessons.length}
                    </LessonStatisticsViewerText>
                }
            </>
        );
    }

    return (
        <>
            { (!loading && lesson) &&
                <LessonStatisticsViewerCard>
                    <LessonStatisticsViewerCardHeader title={`Week ${lesson.sequence} Lesson Statistics`} />
                    <LessonStatisticsViewerCardContent>
                        <LessonStatisticsViewerColumn>
                        { showTotalNumberOfCompletedLessons() }
                        </LessonStatisticsViewerColumn>
                    </LessonStatisticsViewerCardContent>
                </LessonStatisticsViewerCard>
            }
        </>
    )
}

export default LessonStatisticsViewerHeader;