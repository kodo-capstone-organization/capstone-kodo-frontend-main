import { CardActionArea } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { CardMedia } from "@material-ui/core";
import { CourseCardWrapper, CourseCardContent, TypoGraphyCustom } from "./CourseCardElements";
import { Course } from "../../entities/Course";
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
    }, [props.course, props.isCourseCompleted, props.myCourseView, props.redirectUrlBase])

    const handleImageError = (e: any) => {
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
                        <TypoGraphyCustom>{course?.name} &nbsp;</TypoGraphyCustom>
                        { !course?.isEnrollmentActive && !course?.isReviewRequested && myCourseView &&
                            <Chip
                                variant="outlined"
                                size="small"
                                label="Unpublished"
                                style={{ color: "gray", border: "1px solid gray" }}
                            />
                        }
                        { !course?.isEnrollmentActive && course?.isReviewRequested && myCourseView &&
                            <Chip
                                variant="outlined"
                                size="small"
                                label="Pending Review"
                                style={{ color: "orange", border: "1px solid orange" }}
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
                    <TypoGraphyCustom
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        {course?.tutor?.name || "" }
                    </TypoGraphyCustom>
                </CourseCardContent>
            </CardActionArea>
        </CourseCardWrapper>
    )
}

export default CourseCard;