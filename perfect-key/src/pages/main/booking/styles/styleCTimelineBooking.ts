import { createStyles } from 'theme'

export const styleCTimelineBooking = createStyles((theme) => ({
    title:{
        fontWeight: "600",
        fontSize: "20px",
        lineHeight: "27px",
        color: "#00293B",
        height:"60px"
    },
    timeline:{
        "& .ant-timeline-item-last":{
            paddingBottom:"0px"
        }
    },
    dateTimeline: {
        fontWeight: "600",
        fontSize: "12px",
        lineHeight: "16px",
        color: "#666666",
        paddingTop: "4px"
    },
    linkTimeline: {
        fontSize: "14px",
        lineHeight: "19px",
        color: "#1A87D7",
        textDecorationLine: "underline",
        cursor: "pointer"
    },
    circleDefault: {
        width:"20px",
        height:"20px",
        background: "#FFFFFF",
        border: "1px solid #C4C4C4",
        borderRadius:"50%"
    },
    circleSuccess:{
        width:"20px",
        height:"20px",
        background: "#4CAF50",
        borderRadius:"50%"
    }
}))
