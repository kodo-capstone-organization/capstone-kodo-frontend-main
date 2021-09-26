import { ArgumentAxis, Chart, Legend, PieSeries, Title, ValueAxis } from "@devexpress/dx-react-chart-material-ui";
import { Animation, LineSeries, Palette } from '@devexpress/dx-react-chart';
import { Container, FormControl, Grid, MenuItem, Paper, Toolbar } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { NestedCourseStats, TutorCourseEarningsResp } from "../../../../apis/Entities/Transaction";
import { getCourseEarningsPageData } from "../../../../apis/Transaction/TransactionApis";
import {BigStatCaptionDiv, BigStatNumberDiv, ProfileCard, ProfileCardContent, ProfileCardHeader } from "../../ProfileElements";
import { colours, paletteColours } from "../../../../values/Colours";
import { fontSizes } from "../../../../values/FontSizes";
import { MONTHS } from "../../../../values/DateTime";
import { Select } from "@material-ui/core";

const SummaryChartTitleComponent = ({ ...textProps }) => (
    <Title.Text text={textProps.text} style={{ fontSize: fontSizes.SUBHEADER, color: colours.GRAY3, paddingTop: "0.5rem" }}/>
);

const LegendRootComponent = ({...rootProps}) => (
    <Legend.Root children={rootProps.children} {...rootProps} style={{ display: 'flex', margin: 'auto', flexDirection: 'row', flexWrap: "wrap" }} />
);

const LegendLabelComponent = ({...legendProps}) => (
    <Legend.Label text={legendProps.text} {...legendProps} style={{ color: colours.GRAY3 }} />
);

function CourseEarningsTabPanel(props: any) {

    const [accountId, setAccountId] = useState<string>("");
    const [myEarnings, setMyEarnings] = useState<TutorCourseEarningsResp>();
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedCourseItem, setSelectedCourseItem] = useState<NestedCourseStats>();

    useEffect(() => {
        setAccountId(props.accountId)
    }, [props.accountId])

    useEffect(() => {
        if (accountId) {
            getCourseEarningsPageData(parseInt(accountId))
                .then(myEarnings => {
                    setMyEarnings(myEarnings)
                    if (myEarnings.courseStatsByMonthForLastYear.length > 0) {
                        setSelectedCourseId(myEarnings.courseStatsByMonthForLastYear[0].courseId) // default to first course in list
                    }
                })
                .catch(error => console.log("Error retrieving my earnings"))
        }
    }, [accountId])

    useEffect(() => {
        if (myEarnings && myEarnings.courseStatsByMonthForLastYear.length > 0)
        {
            const selectedCourse = myEarnings.courseStatsByMonthForLastYear.find(item => item.courseId === selectedCourseId)
            if (typeof selectedCourse?.data === "string") { // first time accessing, need to format some of its data
                // @ts-ignore
                selectedCourse['data'] = JSON.parse(selectedCourse['data']).reverse()
                // @ts-ignore
                selectedCourse['data'].forEach((datapoint: any) => datapoint.earnings = parseFloat(datapoint.earnings)) // string to number
            }
            setSelectedCourseItem(selectedCourse);
        }
    }, [selectedCourseId])

    const getCurrentMonthYear = () => {
        const curDate = new Date();
        const curYear = curDate.getFullYear();
        const curMonthNum = curDate.getMonth();
        return `${MONTHS[curMonthNum]} ${curYear}`
    }

    const handleChangeCourse = (event: any) => {
        setSelectedCourseId(event.target.value);
    };

    return (
        <>
            <ProfileCard id="summary">
                <ProfileCardHeader style={{ padding: "0.75rem 1rem"}} title="Summary"/>
                { myEarnings &&
                <ProfileCardContent >
                    <Grid container spacing={3}>
                        <Grid item xs={2} >
                            <Paper elevation={2} style={{ height: "48%"}}>
                                <Container style={{ padding: "1rem", color: colours.GRAY3, height: "100%"}}>
                                    <BigStatCaptionDiv># of Student Enrollments</BigStatCaptionDiv>
                                    <BigStatNumberDiv>{myEarnings.totalEnrollmentCount}</BigStatNumberDiv>
                                </Container>
                            </Paper>
                            <br/>
                            <Paper elevation={2} style={{ height: "48%"}}>
                                <Container style={{ padding: "1rem", color: colours.GRAY3, height: "100%" }}>
                                    <BigStatCaptionDiv># of Published Courses (out of all my Courses)</BigStatCaptionDiv>
                                    <BigStatNumberDiv>{myEarnings.totalPublishedCourseCount}<span style={{ fontSize: fontSizes.HEADER, color: colours.GRAY4 }}>/{myEarnings.totalCourseCount}</span></BigStatNumberDiv>
                                </Container>
                            </Paper>
                        </Grid>
                        <Grid item xs={5}>
                            <Paper elevation={2}>
                                <Chart data={myEarnings?.currentMonthEarningsByCourse.filter(stat => stat.earnings > 0)} >
                                    <Palette scheme={paletteColours}/>
                                    <PieSeries valueField="earnings" argumentField="courseNameWithEarnings" innerRadius={0.5} />
                                    <Legend position="bottom" rootComponent={LegendRootComponent} labelComponent={LegendLabelComponent}/>
                                    <Title text={`${getCurrentMonthYear()} Earnings: $${myEarnings.currentMonthTotalEarnings} `} textComponent={SummaryChartTitleComponent}/>
                                    <Animation />
                                </Chart>
                            </Paper>
                        </Grid>
                        <Grid item xs={5}>
                            <Paper elevation={2}>
                                <Chart data={myEarnings?.lifetimeEarningsByCourse.filter(stat => stat.earnings > 0)}>
                                    <Palette scheme={paletteColours}/>
                                    <PieSeries valueField="earnings" argumentField="courseNameWithEarnings" innerRadius={0.5} />
                                    <Legend position="bottom" rootComponent={LegendRootComponent} labelComponent={LegendLabelComponent}/>
                                    <Title text={`Lifetime Earnings: $${myEarnings.lifetimeTotalEarnings} `} textComponent={SummaryChartTitleComponent} />
                                    <Animation />
                                </Chart>
                            </Paper>
                        </Grid>
                    </Grid>
                </ProfileCardContent>
                }
            </ProfileCard>
            <br/>
            <br/>
            { myEarnings && selectedCourseId && selectedCourseItem && selectedCourseItem?.data.length > 0 &&
                <ProfileCard id="course-stats">
                    <ProfileCardHeader style={{ padding: "0.75rem 1rem"}} title="Course Statistics"/>

                    <ProfileCardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={8}>
                                <Paper elevation={2}>
                                    <Chart data={selectedCourseItem?.data}>
                                        <Palette scheme={paletteColours}/>
                                        <ArgumentAxis />
                                        <ValueAxis />

                                        <LineSeries
                                            name="Earnings"
                                            valueField="earnings"
                                            argumentField="monthyear"
                                        />
                                        <Title text={`Course Earnings for ${selectedCourseItem.courseName}`} textComponent={SummaryChartTitleComponent}/>
                                    </Chart>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper elevation={2} style={{ height: "100%"}}>
                                    <Toolbar style={{ background: colours.GRAY7 }}>
                                        <span style={{ color: colours.GRAY3 }}>My Course</span>: &nbsp;&nbsp;
                                        <FormControl variant="outlined" size="small">
                                            <Select id="course-select" value={selectedCourseId} onChange={handleChangeCourse}>
                                                { myEarnings?.courseStatsByMonthForLastYear.map(item => (
                                                    <MenuItem value={item.courseId}>{item.courseName}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Toolbar>
                                    <Container style={{ paddingTop: "1rem", color: colours.GRAY3 }}>
                                        <br/>
                                        Lifetime Earnings: <strong style={{ color: colours.DARKBLUE1 }}>${selectedCourseItem.lifetimeEarnings}</strong>
                                        <br/>
                                        <br/>
                                        This Month's Earnings: <strong style={{ color: colours.DARKBLUE1 }}>${selectedCourseItem.currentMonthEarnings}</strong>
                                        <br/>
                                        <br/>
                                        Highest Earning Month: <strong style={{ color: colours.DARKBLUE1 }}>{selectedCourseItem.highestEarningMonthWithValue}</strong>
                                        <br/>
                                        <br/>
                                        Monthly Average Earnings: <strong style={{ color: colours.DARKBLUE1 }}>${selectedCourseItem.monthlyAverageEarnings}</strong>
                                    </Container>
                                </Paper>
                            </Grid>
                        </Grid>
                    </ProfileCardContent>
                </ProfileCard>
            }
        </>
    )
}

export default CourseEarningsTabPanel;