import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Course } from "../../../apis/Entities/Course";
import { Account } from "../../../apis/Entities/Account";
import { getAllCourses, getCoursesToRecommend } from "../../../apis/Course/CourseApis";
import { getMyAccount } from "../../../apis/Account/AccountApis";

import { colours } from "../../../values/Colours";

import {
  BrowseContainer,
  CourseWrapper,
  Title,
  InputWrapper,
  CourseTags,
  TagChip
} from "./BrowseCourseElements";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import ChipInput from "material-ui-chip-input";
import { Chip } from "@material-ui/core";
import CourseCard from "../../../components/CourseCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch"
      }
    },
    chipInput: {
      width: "100%"
    }
  })
);

function BrowseCourse() {
  const classes = useStyles();
  const [courses, setCourses] = useState<Course[]>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [coursesRecommended, setCoursesRecommended] = useState<Course[]>();
  const [myAccount, setAccount] = useState<Account>();

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    getAllCourses().then(allCourses => {
      setCourses(allCourses);
      console.log(courses);
    });
  }, []);

  useEffect(() => {
    getCoursesToRecommend(accountId).then(receivedCourses => {
      setCoursesRecommended(receivedCourses);
      console.log(coursesRecommended);
    });
  }, []);

  /** 
  useEffect(() => {
    getMyAccount(accountId).then(receivedAccount => {
      setAccount(receivedAccount);
      console.log(myAccount);
    });
  }, []);
  */

  /** HELPER METHODS */
  const handleChipChange = (chips: any) => {
    setTags(chips);
  };
  console.log("tags", tags);

  const handleSearchTerm = (term: any) => {
    setSearchTerm(term);
  };

  //Return an array of Courses that match the tags entered by user
  function returnTagMatch(val: Course): boolean {
    let courseAllTags = val.courseTags;
    var result = courseAllTags.map(function(a) {
      return a.title.toLowerCase();
    });
    console.log(tags.every(t => result.includes(t.toLowerCase())));
    return tags.every(t => result.includes(t.toLowerCase()));
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
          <TextField
            id="outlined-basic"
            label="Search By Name"
            variant="outlined"
            onChange={event => {
              setSearchTerm(event.target.value);
            }}
          />
          <ChipInput
            label="Search By Tags"
            onChange={chips => handleChipChange(chips)}
          />
        </form>
        <Title>Courses</Title>
        <CourseWrapper>
          {courses
              ?.filter(course => course.isEnrollmentActive )
              .filter(course => {
              if (searchTerm == "" && tags.length == 0) {
                return course;
              } else if (tags.length > 0 && returnTagMatch(course)) {
                return course;
              } else if (
                searchTerm !== "" &&
                  course.name.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return course;
              }
            })
            .map(course => {
              return ( <CourseCard course={course} myCourseView={false} redirectUrlBase="/browsecourse/preview" /> );
            })}
        </CourseWrapper>
        <Title>Suggested For You</Title>
        <p>Since you like: </p>
        <CourseTags>
        {myAccount?.interests.map(tag => (
          <TagChip label={tag.title} />
        ))}
        </CourseTags>
        {/* 
        <CourseWrapper>
          {coursesRecommended?.map(course => {
              return ( 
                <>
                  <CourseCard key={course.courseId}>
                    <CardActionArea
                      component={RouterLink}
                      to={`/browsecourse/preview/${course.courseId}`}
                    >
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
        */}
      </BrowseContainer>
    </>
  );
}

export default BrowseCourse;
