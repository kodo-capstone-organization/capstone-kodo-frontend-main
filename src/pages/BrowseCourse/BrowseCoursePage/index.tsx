import { useState, useEffect } from "react";
import { Link as RouterLink } from 'react-router-dom'
import { Course } from "../../../apis/Entities/Course";
import { getAllCourses } from "../../../apis/Course/CourseApis";
import { colours } from "../../../values/Colours";
import TagsInput from "./TagsInput";

import {
  BrowseContainer,
  CourseWrapper,
  CourseCard,
  CourseCardContent,
  Title,
  CourseCardMedia,
  InputWrapper
} from "./BrowseCourseElements";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import ChipInput from 'material-ui-chip-input'
import { Chip } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    media: {
      height: 170,
    },
    chipInput: {
      width: '100%',
    }
  }),
  
);

function BrowseCourse() {
  const classes = useStyles();
  const [courses, setCourses] = useState<Course[]>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    getAllCourses().then(allCourses => {
      setCourses(allCourses);
      console.log(courses);
    });
  }, []);

  /** HELPER METHODS */
  const handleChipChange = (chips: any) => {
      setTags(chips);
  }
  console.log("tags", tags);

  //Return an array of Courses that match the tags entered by user
  const returnTagMatch = (val: Course, tags: string[]) => {
      /** for tag in courseTags, if tags.include(tag.title) return val*/
      let courseTags = val.courseTags;
      courseTags.forEach(function(tag) {
        if (tags.includes(tag.title)) {
          console.log("True")
          return val;
        } 
      });
  }

  /** 
  function handleSelectedTags(items: any) {
      setTags(items);
  }
  */


  return (
    //This would encompass the whole container for component
    <>
    <BrowseContainer>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="outlined-basic" label="Search" variant="outlined" onChange={event => {setSearchTerm(event.target.value)}}/>
        <p>or</p>
        <ChipInput 
        label="Add Tags"
        onChange={(chips) => handleChipChange(chips)}
        />
      </form>
      <Title>Suggested For You</Title>
      <CourseWrapper>
        {courses?.filter((val) => {
          if (searchTerm == "" && tags?.length == 0) {
            return val;
          } else if (tags.length > 0) {
            returnTagMatch(val, tags);
          } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return val;
          } 
        }).map(course => {
          return (
            <>
              <CourseCard key={course.courseId}>
                <CardActionArea component={RouterLink} to={`/browsecourse/preview/${course.courseId}`}>
                  <CardMedia
                    className={classes.media}
                    image="/chessplaceholder.png"
                    title={course.name}
                  />
                  <CourseCardContent>
                    <Typography>{course.name}</Typography>
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
    </>
  );
}

export default BrowseCourse;
