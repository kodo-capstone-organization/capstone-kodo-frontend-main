import { CardActionArea, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { CardMedia } from "@material-ui/core";
import { CourseCardWrapper, CourseCardContent } from "./CourseCardElements";
import { Course } from "../../apis/Entities/Course";
import Chip from "@material-ui/core/Chip";

function CourseCard(props: any) {

    const [course, setCourse] = useState<Course>();
    const [myCourseView, setMyCourseView] = useState<boolean>(false);
    const [isCourseCompleted, setIsCourseCompleted] = useState<boolean>(false);
    const [redirectUrlBase, setRedirectUrlBase] = useState<string>("");

    useEffect(() => {
        setCourse(props.course)
        setMyCourseView(props.myCourseView)
        setIsCourseCompleted(props.isCourseCompleted)
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
                    <div style={{ display: "flex", flexDirection: "row"}}>
                        <Typography>{course?.name} &nbsp;</Typography>
                        { !course?.isEnrollmentActive && myCourseView &&
                            <Chip
                                variant="outlined"
                                size="small"
                                label="Paused"
                                style={{ color: "gray", border: "1px solid gray" }}
                            />
                        }
                        { isCourseCompleted &&
                            <Chip
                                variant="outlined"
                                size="small"
                                label="✓"
                                style={{ color: "green", border: "1px solid green" }}
                            />
                        }
                    </div>
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