import React from 'react'
import { Timeline } from "antd";
import { NavLink } from "react-router-dom";
import { createStyles, useStyleTheme } from 'theme';
import ClassBox from 'components/CClassBox';
import { useTranslation } from 'react-i18next';
const styleTimeline = createStyles((theme) => ({
    timelineMain: {
        marginTop: 10,
    }
}))
export default function CTimeline(props: Props): JSX.Element {
    const classes = useStyleTheme(styleTimeline);
    const { t } = useTranslation("translation")
    return (
        <ClassBox title={t("DASHBOARD.unresolvedTrace")}>
            <div className={`${classes.timelineMain}`}>
                <Timeline style={{ margin: "0 30px" }}>
                    <Timeline.Item color="gray">
                        01-02-2020 06:00 am{" "}
                        <p>
                            <NavLink to="/" style={{ textDecoration: "underline" }}>
                                This is an event link for demo
                            </NavLink>

                        </p>
                    </Timeline.Item>
                    <Timeline.Item color="green">
                        01-02-2020 06:00 am
                        <p>
                            <NavLink to="/" style={{ textDecoration: "underline" }}>
                                This is an event link for demo
                            </NavLink>
                        </p>

                    </Timeline.Item>
                </Timeline>
            </div>
        </ClassBox>
    )
}
