import { CardActionArea, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { CardMedia } from "@material-ui/core";
import { CourseCardWrapper, CourseCardContent } from "./CourseCardElements";
import { Course } from "../../apis/Entities/Course";

function CourseCard(props: any) {

    const [course, setCourse] = useState<Course>();
    const [redirectUrlBase, setRedirectUrlBase] = useState<string>("");

    useEffect(() => {
        setCourse(props.course)
        setRedirectUrlBase(props.redirectUrlBase)
    }, [props.course])

    const handleImageError = (e: any) => {
        console.log("image error")
        e.target.onerror = null;
        e.target.src = "/chessplaceholder.png"
    }

    return (
        <CourseCardWrapper key={course?.courseId}>
            <CardActionArea
                component={RouterLink}
                to={`${redirectUrlBase}/${course?.courseId}`}
            >
                <CardMedia
                    component="img"
                    style={{ height: 170 }}
                    image={course?.bannerUrl === "" ? "invalidurl.com" : course?.bannerUrl }
                    onError={handleImageError}
                    title={course?.name}
                />
                <CourseCardContent>
                    <Typography>{course?.name}</Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        {course?.tutor?.name || "" }
                    </Typography>
                </CourseCardContent>
            </CardActionArea>
        </CourseCardWrapper>
    )
}

export default CourseCard;