import { createStyles } from "theme/Theme";

export const heightSidebar = {
    header: "80px",
    footer: "80px"
}

export const styleInforRoomPlan = createStyles((theme) => ({
    customSelectDate: {
        padding: "0px !important",
        width: "95px",
        '& .ant-picker-input': {
            '& input': {
                fontWeight: "bold",
                fontSize: "13px",
                color: "#666666"
            },
            '& span': {
                color: "#1A87D7"
            },
            '& .ant-picker-suffix': {
                marginTop: "-0.2rem"
            }
        }
    },
    inforRoomPlan: {
        "& .ant-space-item": {
            whiteSpace: "none",
            fontSize: "0.8rem"
        }
    },
    styleBtn: {
        '&.ant-btn, .ant-btn:hover, .ant-btn:active, .ant-btn:focus': {
            border: '1px solid #1A87D7',
            boxSizing: 'border-box',
            borderRadius: '6px',
            height: '40px',
            padding: 0,
            '& span': {
                padding: '8px 8px',
                fontWeight: 600,
                fontSize: '14px'
            }
        }
    },
    styleDropdown: {
        color: "#1A87D7",
        width: 250,
        height: "calc(100vh - 150px)",
        borderRadius: '6px !important'
    }
}));