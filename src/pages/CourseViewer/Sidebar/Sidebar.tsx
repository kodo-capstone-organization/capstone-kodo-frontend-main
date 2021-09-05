import React, {useState, useEffect} from 'react';
import { Course } from "../../../apis/Entities/Course";

function Sidebar(props: any) {
    const [currentCourse, setCourse] = useState<Course>({...props.course});

    useEffect(() => {
        setCourse(props.course)
    }, [props.course])

    let allLessons = currentCourse?.lessons;

    return (
        <div>
            <h3>sidebar for: {currentCourse?.name}</h3>
            {
                allLessons?.map((lesson) => {
                    return (
                        <div key={lesson.lessonId}>
                            <p>
                                {lesson.name}
                            </p>
                        </div>
                    );
                })
            }
        </div>
    )
}

export default Sidebar;