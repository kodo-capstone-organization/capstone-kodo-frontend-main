import { useState, useEffect } from "react";
import { Course, RecommendedCoursesWithTags } from "../../../apis/Entities/Course";
import { Account } from "../../../apis/Entities/Account";
import { getAllCourses, getCoursesToRecommend } from "../../../apis/Course/CourseApis";
import { getMyAccount } from "../../../apis/Account/AccountApis";
import { Tag } from "../../../apis/Entities/Tag";
import {
  BrowseContainer,
  Title,
  CourseTags,
  TagChip,
  TagsContainer
} from "./BrowseCourseElements";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ChipInput from "material-ui-chip-input";
import { TextField, Tabs, Tab, Link } from "@material-ui/core";
import { colours } from "../../../values/Colours";
import BrowseCourseTabPanel from "./components/BrowseCourseTabPanel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "31ch"
      }
    }
  })
);

function BrowseCourse() {
  const classes = useStyles();
  const [courses, setCourses] = useState<Course[]>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [recommendationLimit, _] = useState<number>(5); // default at 5
  const [coursesRecommended, setCoursesRecommended] = useState<Course[]>();
  const [tagsRecommended, setTagsRecommended] = useState<Tag[]>();
  const [myAccount, setAccount] = useState<Account>();
  const [tab, setTab] = useState<number>(0); // track tab index

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    getAllCourses().then(allCourses => {
      setCourses(allCourses);
    });
  }, []);

  useEffect(() => {
    getCoursesToRecommend(accountId, recommendationLimit).then((receivedCoursesWithTags: RecommendedCoursesWithTags) => {
      setCoursesRecommended(receivedCoursesWithTags.courses);
      setTagsRecommended(receivedCoursesWithTags.tags);
    });
  }, []);

  useEffect(() => {
    getMyAccount(accountId).then(receivedAccount => {
      setAccount(receivedAccount);
    });
  }, []);

  /** HELPER METHODS */
  const handleChipChange = (chips: any) => {
    setTags(chips);
  };

  const handleSearchTerm = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };
  
  // This method is to be integrated after Theo finishes new recommended query
  // function getSuggestedTags(coursesRecommended: Course[]) {
  //   const tagArray = []
  //   for (var course of coursesRecommended) {
  //     for (var tag of course.courseTags) {
  //       tagArray.push(tag.title)
  //     }
  //   }
  //   var uniqueArr = tagArray.filter(function(elem, index, self) {
  //     return index === self.indexOf(elem);
  //   })
  //   console.log(uniqueArr)
  //   return(uniqueArr)
  // }

  const handleTabChange = (event: any, newTabIndex: number) => {
    setTab(newTabIndex)
  }

  // Build Tab and their props here
  const getTabItems = () => {
    return [
      { myTabIdx: 0,
        myTabName: "Suggested For Me",
        courseList: coursesRecommended,
        titleComponent: () => 
          <TagsContainer>
            <Title>Because you liked: &nbsp;&nbsp;</Title>
            <CourseTags>
              { tagsRecommended?.map(tag => <TagChip variant="outlined" key={tag.tagId} label={tag.title} /> )}
            </CourseTags>
          </TagsContainer>
      },
      { // TODO: Browsing via popularity e.g. top x number of enrollments OR ratings? :O
        myTabIdx: 1,
        myTabName: "Popular On Kodo",
        courseList: null,
        titleComponent: () => <></>
      },
      { // TODO: Browsing via newest creation e.g. last 10 days?
        myTabIdx: 2,
        myTabName: "New Releases",
        courseList: null,
        titleComponent: () => <></>
      },
      {
        myTabIdx: 3,
        myTabName: "All Available Courses",
        courseList: courses,
        titleComponent: () => <></>
      }
    ]
  }

  return (
    //This would encompass the whole container for component
    <>
      <BrowseContainer>
        {/* Search Inputs */}
        <form className={classes.root} noValidate autoComplete="off">
          <TextField id="name-search" label="Search By Name"  onChange={event => handleSearchTerm(event.target.value)} />
          &nbsp;&nbsp;
          <ChipInput id="tag-search"  label="Search By Tags"  onChange={chips => handleChipChange(chips)} style={{ margin: "0" }} />
        </form>

        {/* Tabs*/}
        <Tabs value={tab} indicatorColor="primary"  textColor="primary"  onChange={handleTabChange}  style={{ backgroundColor: colours.GRAY7, marginBottom: "1.5rem" }}>
          { getTabItems().map(tabItem => <Tab key={tabItem.myTabIdx} label={tabItem.myTabName} style={{ minWidth: "36ch"}}/>) }
        </Tabs>

        <div id="browse-course-panel-group">
          { getTabItems().map(tabItem => (
              <BrowseCourseTabPanel
                  curTabIdx={tab}
                  textSearchTerm={searchTerm}
                  tagSearchTerms={tags}
                  key={tabItem.myTabIdx}
                  myTabIdx={tabItem.myTabIdx}
                  myTabName={tabItem.myTabName}
                  courseList={tabItem.courseList}
                  titleComponent={tabItem.titleComponent}
              />
            ))
          }
        </div>
      </BrowseContainer>
    </>
  );
}

export default BrowseCourse;
