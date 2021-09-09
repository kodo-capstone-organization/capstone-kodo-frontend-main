import { CardActionArea, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { Course } from "../apis/Entities/Course";
import { Link as RouterLink } from "react-router-dom";
import { CardMedia } from "@material-ui/core";
import { CourseCardContent } from "./CourseCard/CourseCardElements";

function CourseCard(props: any) {

    const [course, setCourse] = useState<Course>();
    const [redirectUrlBase, setRedirectUrlBase] = useState<string>("");

    useEffect(() => {
        setCourse(props.course)
        setRedirectUrlBase(props.redirectUrlBase)
    }, [props.course])

    return (
        <CourseCard key={course?.courseId}>
            <CardActionArea
                component={RouterLink}
                to={`${redirectUrlBase}/${course?.courseId}`}
            >
                <CardMedia
                    style={{ height: 170 }}
                    image="/chessplaceholder.png"
                    title={course?.name}
                />
                <CourseCardContent>
                    <Typography>{course?.name}</Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        {course?.tutor.name}
                    </Typography>
                </CourseCardContent>
            </CardActionArea>
        </CourseCard>
    )
}

export default CourseCard;