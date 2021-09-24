import { Chart, Legend, PieSeries, Title } from "@devexpress/dx-react-chart-material-ui";
import { Animation, Palette } from '@devexpress/dx-react-chart';
import { Grid, Paper } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { TutorCourseEarningsResp } from "../../../../apis/Entities/Transaction";
import { getCourseEarningsPageData } from "../../../../apis/Transaction/TransactionApis";
import { BlankStateContainer, ProfileCard, ProfileCardContent, ProfileCardHeader } from "../../ProfileElements";
import { colours, paletteColours } from "../../../../values/Colours";
import { fontSizes } from "../../../../values/FontSizes";
import { MONTHS } from "../../../../values/DateTime";

const SummaryChartTitleComponent = ({ ...textProps }) => (
    <Title.Text text={textProps.text} style={{ fontSize: fontSizes.SUBHEADER, color: colours.GRAY3 }}/>
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

    useEffect(() => {
        setAccountId(props.accountId)
    }, [props.accountId])

    useEffect(() => {
        if (accountId) {
            getCourseEarningsPageData(parseInt(accountId))
                .then(myEarnings => setMyEarnings(myEarnings))
                .catch(error => console.log("Error retrieving my earnings"))
        }
    }, [accountId])

    const getCurrentMonthYear = () => {
        const curDate = new Date();
        const curYear = curDate.getFullYear();
        const curMonthNum = curDate.getMonth();
        return `${MONTHS[curMonthNum]} ${curYear}`
    }

    return (
        <>
            <ProfileCard id="summary">
                <ProfileCardHeader style={{ padding: "0.75rem 1rem"}} title="Summary"/>
                { myEarnings &&
                <ProfileCardContent >
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Paper>
                                <Chart data={myEarnings?.currentMonthEarningsByCourse.filter(stat => stat.earnings > 0)} >
                                    <Palette scheme={paletteColours}/>
                                    <PieSeries valueField="earnings" argumentField="courseNameWithEarnings" innerRadius={0.5} />
                                    <Legend position="bottom" rootComponent={LegendRootComponent} labelComponent={LegendLabelComponent}/>
                                    <Title text={`${getCurrentMonthYear()} Earnings: $${myEarnings.currentMonthTotalEarnings} `} textComponent={SummaryChartTitleComponent}/>
                                    <Animation />
                                </Chart>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper>
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
        </>
    )
}

export default CourseEarningsTabPanel;