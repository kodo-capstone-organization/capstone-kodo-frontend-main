import { Chart, Legend, PieSeries, Title } from "@devexpress/dx-react-chart-material-ui";
import { Animation } from '@devexpress/dx-react-chart';
import { Palette } from '@devexpress/dx-react-chart';
import { Paper } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { TutorCourseEarningsResp } from "../../../../apis/Entities/Transaction";
import { getCourseEarningsPageData } from "../../../../apis/Transaction/TransactionApis";
import { BlankStateContainer, ProfileCard, ProfileCardContent, ProfileCardHeader } from "../../ProfileElements";
import { paletteColours } from "../../../../values/Colours";

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


    return (
        <>
            <ProfileCard id="summary">
                <ProfileCardHeader
                    style={{ padding: "0.75rem 1rem"}}
                    title="Summary"
                />
                { myEarnings &&
                    <ProfileCardContent>
                        <Paper style={{ width: "50%"}}>
                            <Chart data={myEarnings?.currentMonthEarningsByCourse} >
                                <Palette scheme={paletteColours}/>
                                <PieSeries
                                    valueField="earnings"
                                    argumentField="courseName"
                                    innerRadius={0.5}
                                >
                                </PieSeries>
                                <Legend position="bottom"/>
                                <Title text={`Sept 2021 Earnings: $${myEarnings.currentMonthTotalEarnings} `} />
                                <Animation />
                            </Chart>
                        </Paper>
                        <Paper style={{ width: "50%"}}>
                            <Chart data={myEarnings?.lifetimeEarningsByCourse} >
                                <Palette scheme={paletteColours}/>
                                <PieSeries
                                    valueField="earnings"
                                    argumentField="courseName"
                                    innerRadius={0.5}
                                >
                                </PieSeries>
                                <Legend position="bottom"/>
                                <Title text={`Lifetime Earnings: $${myEarnings.lifetimeTotalEarnings} `} />
                                <Animation />
                            </Chart>
                        </Paper>
                    </ProfileCardContent>
                }
            </ProfileCard>
        </>
    )
}

export default CourseEarningsTabPanel;