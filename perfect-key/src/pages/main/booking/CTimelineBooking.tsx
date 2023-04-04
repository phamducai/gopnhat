import { Timeline } from 'antd';
import ClassBox from 'components/CClassBox';
import React from 'react'
import { useStyleTheme } from 'theme'
import CIconSvg from 'components/CIconSvg';
import { styleCTimelineBooking } from './styles/styleCTimelineBooking';
import { useTranslation } from 'react-i18next';

const CTimelineBooking = (props: Props): JSX.Element => {    
    const classes = useStyleTheme(styleCTimelineBooking);
    const { t } = useTranslation("translation")

    const renderDefault = () => (
        <div className={`${classes.circleDefault}`} />
    )

    const renderSuccess = () => (
        <div className={`${classes.circleSuccess} flex items-center justify-center`}>
            <CIconSvg name="check" svgSize="small" colorSvg="light" />
        </div>
    )

    return (
        <ClassBox className={props.className}>
            <div className={`${classes.title} flex items-center mb-1`}>{t("BOOKING.unresolvedTrace")}</div>
            <Timeline className={`${classes.timeline}`}>
                <Timeline.Item dot={renderDefault()}>
                    <div className={`${classes.dateTimeline}`}>01-02-2020 06:00 am</div>
                    <div className={`${classes.linkTimeline}`}>This is an event link for demo</div>
                    <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum magnam voluptate optio! Ipsum voluptates animi molestias consectetur!</div>
                </Timeline.Item>
                <Timeline.Item dot={renderSuccess()}>
                    <div className={`${classes.dateTimeline}`}>01-02-2020 06:00 am</div>
                    <div className={`${classes.linkTimeline}`}>This is an event link for demo</div>
                    <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</div>
                </Timeline.Item>
            </Timeline>
        </ClassBox>
    )
}
export default React.memo(CTimelineBooking)