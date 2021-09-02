import { CourseBuilderCard, CourseBuilderCardHeader, CourseBuilderContainer } from "./CourseBuilderElements";

function CourseBuilderPage() {

    return (
        <CourseBuilderContainer>
            <CourseBuilderCard id="course-information">
                <CourseBuilderCardHeader
                    title="Course Information"
                />
            </CourseBuilderCard>
            <CourseBuilderCard id="lesson-plan">
                <CourseBuilderCardHeader
                    title="Lesson Plan"
                />
            </CourseBuilderCard>
        </CourseBuilderContainer>
    )
}

export default CourseBuilderPage;