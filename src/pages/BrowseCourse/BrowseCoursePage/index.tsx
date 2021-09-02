import {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import { Course } from '../../../apis/Entities/Course'
import { getAllCourses } from '../../../apis/Course/CourseApis';


function BrowseCourse() {
    const [courses, setCourses] = useState<Course[]>();
    const history = useHistory();

    useEffect(() => {
        getAllCourses().then(allCourses => {
            setCourses(allCourses)
            console.log(allCourses)
        });
    }, []);

    return (
        <div>
            {courses?.map((course) => {
                return (
                    <>
                        <div key={course.courseId}>
                            <img src={course.bannerUrl} />
                            <h1>{course.name}</h1>
                            <p>{course.description}</p>
                        </div>
                    </>
                )
            })}
        </div>
    )
}

export default BrowseCourse;

