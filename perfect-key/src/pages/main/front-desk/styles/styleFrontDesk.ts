import { createStyles, ThemeDefine } from 'theme'

export const styleFrontDesk = createStyles((theme: ThemeDefine) => ({
    collapse: {
        "& .ant-collapse-content > .ant-collapse-content-box": {
            padding: "0px !important"
        },
        "& .ant-collapse-header": {
            paddingBottom: "0px !important",
            paddingLeft: "0px !important"
        },
    },
    breadcrumb: {
        fontWeight: "600",
        fontSize: "20px",
        lineHeight: "6px",
        color: "#00293B",
    },
    titleColHeader: {
        width: "300px",
        height: "40px",
        backgroundColor: "#1A87D7",
        textAlign: "center",
        float: "right",
        padding: "10px",
        borderRadius: "5px"
    },
    spanTitleColHeader: {
        fontWeight: "600",
        family: "Open Sans",
        fontSize: "14px",
        color: "#FFFFFF"
    },
    bgTipsAndGuides: {
        backgroundColor: "#FCF3D7",
        border: "1px solid #F3AA18"
    },
    datePicker: {
        "&.ant-picker": {
            padding: "0px !important",
            borderRadius: "6px",
            height: "42px",

        },
        "& .ant-picker-input": {
            background: "#F5F6F7",
            height: "40px !important",
            padding: "0 10px",
            borderRadius: "6px"
        },
        "& .ant-picker-suffix": {
            color: "#1A87D7",
            display: "flex",
            alightItems: "center"
        },
        "& .ant-picker-active-bar": {
            bottom: "0px !important",
            marginLeft: "0px !important"
        },
        "& .ant-picker-range-separator": {
            padding: "0px"
        },
        "&.ant-picker-focused": {
            borderColor: "#d9d9d9",
            boxShadow: "none"
        },
        "&.ant-card-body": {
            padding: "10px !important"
        }
    },
    btn: {
        background: "#1A87D7",
        width: "100%",
        '&:hover': {
            background: "#078aea",
        }
    }
}))