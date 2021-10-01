import { useState, useEffect } from "react";

import { Course } from "../../../../apis/Entities/Course";

import CourseCard from "../../../../components/CourseCard";

import { CourseWrapper } from "../BrowseCourseElements";

function BrowseCourseTabPanel (props: any) {
    const [curTabIdx, setCurTabIdx] = useState<number>(0);
    const [curMyName, setMyTabName] = useState<string>("");
    const [myTabIdx, setMyTabIdx] = useState<number>(0);
    const [textSearchTerm, setTextSearchTerm] = useState<string>("");
    const [tagSearchTerms, setTagSearchTerms] = useState<string[]>([]);
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [titleComponent, setTitleComponent] = useState<() => void>(() => <></>);
    
    useEffect(() => {
        setCurTabIdx(props.curTabIdx);
        setMyTabName(props.myTabName);
        setMyTabIdx(props.myTabIdx);
        setTextSearchTerm(props.textSearchTerm);
        setTagSearchTerms(props.tagSearchTerms);
        setCourseList(props.courseList);
        setTitleComponent(props.titleComponent)
    }, [props.curTabIdx, props.curTabName, props.myTabIdx, props.textSearchTerm, 
        props.tagSearchTerms, props.courseList, props.titleComponent
    ])

    // Check if given course matches all the inputted tag search terms
    const areTagsMatched = (course: Course): boolean => {
        const allCourseTags = course.courseTags;
        const allLowerCaseTagTitles = allCourseTags.map(function(a) {
            return a.title.toLowerCase();
        });
        return tagSearchTerms.every(t => allLowerCaseTagTitles.includes(t.toLowerCase()));
    }

    const isTextMatched = (course: Course): boolean => {
        return course.name.toLowerCase().includes(textSearchTerm.toLowerCase())
    }

    return(
        <>
            { curTabIdx === myTabIdx &&
                <div role="tabpanel">
                    { titleComponent }
                    <br/>
                    <CourseWrapper>
                        { courseList
                            ?.filter(course => course.isEnrollmentActive)
                            .filter(course => {
                                if (textSearchTerm === "" && tagSearchTerms.length === 0) { return course; }
                                else if (tagSearchTerms.length > 0 && areTagsMatched(course)) { return course; }
                                else if (textSearchTerm !== "" && isTextMatched(course)) { return course; }
                            })
                            .map(course => <CourseCard course={course} key={course.courseId} myCourseView={false} redirectUrlBase="/browsecourse/preview" /> )
                        }
                    </CourseWrapper>
                </div>
            }
        </>
    )
}

export default BrowseCourseTabPanel;