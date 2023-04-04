import { createStyles, ThemeDefine } from 'theme'

export const styleBooking = createStyles((theme: ThemeDefine) => ({
    booking: {
        height: `calc(${theme.height.fullScreen} - ${theme.height.navbar})`,
    },
    sidebar: {
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
    },
    breadcrumb: {
        fontWeight: "600",
        fontSize: "20px",
        lineHeight: "27px",
        color: "#00293B",
    },
    selectedRoom: {
        fontSize: "12px",
        lineHeight: "20px",
        color: "#00293B",
        marginTop: "23px",
        "& .selectedRoomSpan": {
            color: "#1A87D7",
            fontWeight: "600",
            fontSize: "16px",
            lineHeight: "20px",
        }
    },
    bgTipsAndGuides: {
        backgroundColor: "#FCF3D7",
        border: "1px solid #F3AA18"
    },
    collapse:{
        "& .ant-collapse-content > .ant-collapse-content-box":{
            padding: "0px !important"
        },
        "& .ant-collapse-header":{
            paddingBottom: "0px !important",
            paddingLeft: "0px !important"
        },
    }
}))