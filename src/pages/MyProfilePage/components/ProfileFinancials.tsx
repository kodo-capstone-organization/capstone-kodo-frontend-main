import { Tabs } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import {useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { colours } from "../../../values/Colours";

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
                myTabName: "Payments History"
            },
            {
                myTabIdx: 1,
                myTabName: "Course Earnings"
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
        </>
    )
}

export default ProfileFinancials;