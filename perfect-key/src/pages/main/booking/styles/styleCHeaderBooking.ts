import { createStyles } from 'theme'

export const styleCHeaderBooking = createStyles((theme) => ({
    rangePicker: {
        minWidth: "402px",
        height: "36px"
    },
    spanNewRSVNGroup: {
        fontWeight: "600",
        fontSize: "14px"
    }
    ,
    btn: {
        borderRadius: "8px",
        backgroundColor: "#1A87D7",
        color: "#FFFFFF",
        fontWeight: "600 !important",
        fontSize: "14px",
        lineHeight: "20px",
        padding: "10px 16px",
        width: "193px"
    },
    btnSetDate: {
        width: "120px !important",
        color: "#00293B  !important",
        fontWeight: "600",
        backgroundColor: "#F0F2F5  !important",
        "&.ant-btn": {
            background: "#F0F2F5",
            borderRadius: "4px",
            borderColor: "transparent",
            height: "36px",
            width: "100%"
        },
        "&.ant-btn:hover": {
            background: "#F0F2F9",
            color: "#00293B",
            borderColor: "transparent",
        },
        "&.ant-btn:active": {
            color: "#00293B",
            background: "#F0F2F5",
            borderColor: "transparent",
        },
        "&.ant-btn:focus": {
            color: "#00293B",
            background: "#F0F2F5",
            borderColor: "transparent",
        }
    },
}))