import { useState, useEffect } from "react";
import { Course } from "../../../apis/Entities/Course";
import { Account } from "../../../apis/Entities/Account";
import { getAllCourses, getCoursesToRecommend } from "../../../apis/Course/CourseApis";
import { getMyAccount } from "../../../apis/Account/AccountApis";
import { getAllTags } from '../../../apis/Tag/TagApis';
import { Tag } from "../../../apis/Entities/Tag";


import {
  BrowseContainer,
  CourseWrapper,
  Title,
  InputWrapper,
  CourseTags,
  TagChip
} from "./BrowseCourseElements";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ChipInput from "material-ui-chip-input";
import CourseCard from "../../../components/CourseCard";
import { Autocomplete } from "@material-ui/lab";
import {
  Typography, TextField, Chip
} from "@material-ui/core";

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
  const [tagLibrary, setTagLibrary] = useState<Tag[]>([]);

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    getAllCourses().then(allCourses => {
      setCourses(allCourses);
    });
  }, []);

  useEffect(() => {
    getAllTags().then(res => setTagLibrary(res)).catch(error => console.log("error getting tags."))
  }, [])

  useEffect(() => {
    getCoursesToRecommend(accountId).then(receivedCourses => {
      setCoursesRecommended(receivedCourses);
      console.log(coursesRecommended);
    });
  }, []);

  useEffect(() => {
    getMyAccount(accountId).then(receivedAccount => {
      setAccount(receivedAccount);
    });
  }, []);

  /** HELPER METHODS */
  const handleChipChange = (e: object, value: string[], reason: string) => {
    console.log(value)
    setTags(value)
  }

  const handleSearchTerm = (term: any) => {
    setSearchTerm(term);
  };

  //Return an array of Courses that match the tags entered by user
  function returnTagMatch(val: Course): boolean {
    let courseAllTags = val.courseTags;
    var result = courseAllTags.map(function (a) {
      return a.title.toLowerCase();
    });
    return tags.every(t => result.includes(t.toLowerCase()));
  }

  // This method is to be integrated after Theo finishes new recommended query
  function getSuggestedTags(coursesRecommended: Course[]) {
    const tagArray = []
    for (var course of coursesRecommended) {
      for (var tag of course.courseTags) {
        tagArray.push(tag.title)
      }
    }
    var uniqueArr = tagArray.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    console.log(uniqueArr)
    return (uniqueArr)
  }
  /*
  if (coursesRecommended) {
    console.log(getSuggestedTags(coursesRecommended))
  }*/

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
          <Autocomplete
            multiple
            freeSolo
            options={tagLibrary.map((option) => option.title)}
            defaultValue={[]}
            onChange={handleChipChange}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip {...getTagProps({ index })} variant="outlined" label={option} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Search By Tags" />
            )}
          />
        </form>
        <Title>Courses</Title>
        <CourseWrapper>
          {courses
            ?.filter(course => course.isEnrollmentActive)
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
              return (<CourseCard course={course} myCourseView={false} redirectUrlBase="/browsecourse/preview" />);
            })}
        </CourseWrapper>
        <Title>Suggested For You</Title>
        <p>Since you like: </p>
        <CourseTags>
          {myAccount?.interests.map(tag => (
            <TagChip label={tag.title} />
          ))}
        </CourseTags>
        <CourseWrapper>
          {coursesRecommended?.map(course => {
            return (<CourseCard course={course} myCourseView={false} redirectUrlBase="/browsecourse/preview" />);
          })}
        </CourseWrapper>
      </BrowseContainer>
    </>
  );
}

export default BrowseCourse;
