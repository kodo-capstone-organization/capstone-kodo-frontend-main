import { Tabs } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import {useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { colours } from "../../../values/Colours";
import CourseEarningsTabPanel from "./financials/CourseEarningsTabPanel";
import PaymentsHistoryTabPanel from "./financials/PaymentsHistoryTabPanel";

function ProfileFinancials(props: any) {

    const [accountId, setAccountId] = useState<string>();
    const [curTabIdx, setCurTabIdx] = useState<number>();
    const location = useLocation<any>();

    useEffect(() => {
        setAccountId(window.sessionStorage.getItem("loggedInAccountId") || "")
        setCurTabIdx(location?.state?.initialTabIdx || 0)
    }, [location])

    const handleTabChange = (event: any, newTabIndex: number) => {
        setCurTabIdx(newTabIndex);
    };

    const getTabItems = () => {
        return [
            {
                myTabIdx: 0,
                myTabName: "Payments History",
                tabPanelComponent: <PaymentsHistoryTabPanel key={0} accountId={accountId} />
            },
            {
                myTabIdx: 1,
                myTabName: "Course Earnings",
                tabPanelComponent: <CourseEarningsTabPanel key={1} />
            }
        ]
    }

    return (
        <>
            <Tabs
                value={curTabIdx}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
                style={{ backgroundColor: colours.GRAY7, marginBottom: "1.5rem" }}
            >
                {getTabItems().map(tabItem => (
                    <Tab
                        key={tabItem.myTabIdx}
                        label={tabItem.myTabName}
                        style={{ minWidth: "50%"}}
                    />
                ))}
            </Tabs>
            <div id="financials-tab-panel-group">
                { getTabItems()
                    .filter((tabItem) => tabItem?.myTabIdx === curTabIdx)
                    .map(tabItem => (tabItem.tabPanelComponent))
                }
            </div>
        </>
    )
}

export default ProfileFinancials;