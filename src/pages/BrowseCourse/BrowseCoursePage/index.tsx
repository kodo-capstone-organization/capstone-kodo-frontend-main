import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Course } from "../../../apis/Entities/Course";
import { getAllCourses } from "../../../apis/Course/CourseApis";
import { colours } from "../../../values/Colours";
import {
  BrowseContainer,
  CourseWrapper,
  CourseCard,
  CourseCardContent,
  Title
} from "./BrowseCourseElements";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    maxWidth: 300
  },
  media: {
    height: 170
  }
});

function BrowseCourse() {
  const classes = useStyles();
  const [courses, setCourses] = useState<Course[]>();
  const history = useHistory();

  useEffect(() => {
    getAllCourses().then(allCourses => {
      setCourses(allCourses);
      console.log(allCourses);
    });
  }, []);

  return (
    //This would encompass the whole container for cards
    <BrowseContainer>
      <h3>search bar goes here</h3>
      <Title>Suggested For You</Title>
      <CourseWrapper>
      {courses?.map(course => {
        return (
            <>
            <CourseCard key={course.courseId}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="placeholder/placeholderbanner.jpg"
                  title={course.name}
                />
                <CourseCardContent>
                  <Typography>
                    {course.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {course.tutor.name}
                  </Typography>
                </CourseCardContent>
              </CardActionArea>
            </CourseCard>
            </>
        );
      })}
      </CourseWrapper>
    </BrowseContainer>
  );
}

export default BrowseCourse;
