import {useState, useEffect} from 'react'
import { getAllCourses } from '../../../apis/Course/CourseApis';


function BrowseCourse() {
    const [appState, setAppState] = useState({
        loading: true,
        posts: null,
    });

    useEffect(() => {
        const allCourses = Array.from(getAllCourses)
        setAppState({loading: false, posts: allCourses}, console.log(allCourses));
    }, [setAppState]);

    return (
        <div>

        </div>
    )
}

export default BrowseCourse

