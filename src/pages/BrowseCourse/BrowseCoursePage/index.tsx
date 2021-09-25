import { useState, useEffect } from "react";
import {
  Course,
  RecommendedCoursesWithTags
} from "../../../apis/Entities/Course";
import { Account } from "../../../apis/Entities/Account";
import {
  getAllCourses,
  getCoursesToRecommend
} from "../../../apis/Course/CourseApis";
import { getMyAccount } from "../../../apis/Account/AccountApis";
import { Tag } from "../../../apis/Entities/Tag";
import { getAllTags } from "../../../apis/Tag/TagApis";

import {
  BrowseContainer,
  Title,
  CourseTags,
  TagChip,
  TagsContainer,
  SearchContainer,
  MessageContainer,
} from "./BrowseCourseElements";
import CircularProgress from '@material-ui/core/CircularProgress';
import { TextField, Tabs, Tab, Chip } from "@material-ui/core";
import { colours } from "../../../values/Colours";
import { Autocomplete } from "@material-ui/lab";
import BrowseCourseTabPanel from "./components/BrowseCourseTabPanel";

function BrowseCourse() {
  const [courses, setCourses] = useState<Course[]>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [recommendationLimit, _] = useState<number>(5); // default at 5
  const [coursesRecommended, setCoursesRecommended] = useState<Course[]>();
  const [tagsRecommended, setTagsRecommended] = useState<Tag[]>();
  const [myAccount, setAccount] = useState<Account>();
  const [tab, setTab] = useState<number>(0); // track tab index
  const [tagLibrary, setTagLibrary] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const accountId = JSON.parse(
    window.sessionStorage.getItem("loggedInAccountId") || "{}"
  );

  useEffect(() => {
    setLoading(true);
    getAllCourses().then(allCourses => {
      setCourses(allCourses);
    });
    getCoursesToRecommend(accountId, recommendationLimit).then(
      (receivedCoursesWithTags: RecommendedCoursesWithTags) => {
        setCoursesRecommended(receivedCoursesWithTags.courses);
        setTagsRecommended(receivedCoursesWithTags.tags);
      }
    );
    getMyAccount(accountId).then(receivedAccount => {
      setAccount(receivedAccount);
    });
    getAllTags()
      .then(res => setTagLibrary(res))
      .catch(error => console.log("error getting tags."));
    setLoading(false);
  }, []);


  /** HELPER METHODS */
  const handleChipChange = (e: object, value: string[], reason: string) => {
    console.log(value);
    setTags(value);
  };

  const handleSearchTerm = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleTabChange = (event: any, newTabIndex: number) => {
    setTab(newTabIndex);
  };
  
  const getNewReleases = () => { // courses created in the last 14 days
    const nowDate = new Date()
    // @ts-ignore
    return courses?.filter(course => nowDate - new Date(course.dateTimeOfCreation).getDate() >= 14 )
  }

  // Build Tab and their props here
  const getTabItems = () => {
    return [
      {
        myTabIdx: 0,
        myTabName: "Suggested For Me",
        courseList: coursesRecommended,
        titleComponent: () => (
          <TagsContainer>
            <Title>Because you liked: &nbsp;&nbsp;</Title>
            <CourseTags>
              {tagsRecommended?.map(tag => (
                <TagChip variant="outlined" key={tag.tagId} label={tag.title} />
              ))}
            </CourseTags>
          </TagsContainer>
        )
      },
      {
        // TODO: Browsing via popularity e.g. top x number of enrollments OR ratings? :O
        myTabIdx: 1,
        myTabName: "Popular On Kodo",
        courseList: null,
        titleComponent: () => <></>
      },
      {
        // TODO: Browsing via newest creation e.g. last 10 days?
        myTabIdx: 2,
        myTabName: "New Releases",
        courseList: () => getNewReleases(),
        titleComponent: () => <></>
      },
      {
        myTabIdx: 3,
        myTabName: "All Available Courses",
        courseList: courses,
        titleComponent: () => <></>
      }
    ];
  };

  if (loading) return (
    <MessageContainer><CircularProgress /></MessageContainer>
  );
  

  return (
    <>
      <BrowseContainer>
        {/* Search Inputs */}
        <SearchContainer>
          <TextField
            id="name-search"
            variant="outlined"
            label="Search By Name"
            onChange={event => handleSearchTerm(event.target.value)}
            style={{ width: 300 }}
          />
          &nbsp;&nbsp;
          <Autocomplete
            multiple
            freeSolo
            options={tagLibrary.map(option => option.title)}
            defaultValue={[]}
            onChange={handleChipChange}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  {...getTagProps({ index })}
                  variant="outlined"
                  label={option}
                />
              ))
            }
            style={{ width: 300 }}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                label="Search By Tags"
              />
            )}
          />
        </SearchContainer>

        {/* Tabs*/}
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          style={{ backgroundColor: colours.GRAY7, marginBottom: "1.5rem" }}
        >
          {getTabItems().map(tabItem => (
            <Tab
              key={tabItem.myTabIdx}
              label={tabItem.myTabName}
              style={{ width: "25%"}}
            />
          ))}
        </Tabs>

        <div id="browse-course-panel-group">
          {getTabItems().map(tabItem => (
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
          ))}
        </div>
      </BrowseContainer>
    </>
  );
}

export default BrowseCourse;
