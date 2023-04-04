import { createStyles } from "theme/Theme";
export const styleCombineGuest = createStyles((theme) => ({
    selectBackground: {
        "& .ant-select-selector": {
            backgroundColor: "#F5F6F7 !important",
            height: "40px !important",
            alignItems: "center !important",
            borderRadius: "6px !important",
            '& span': {
                '& .ant-select-selection-search-input': {
                    height: "38px !important"
                }
            }
        },
        '& .ant-select-arrow': {
            color: "#1A87D7"
        },
    },
    text: {
        color: '#00293B',
        textAlign: "start"
    },
    borderContent: {
        border: "1px solid #E7E7E7",
        borderRadius: "6px",
        padding: "0.7rem"
    },
    btn: {
        "& .ant-btn": {
            height: "40px",
            marginTop: "20px",
            borderRadius: "8px",
            background: "#1A87D7",
            fontWeight: "600"
        }
    },
    datePicker: {
        borderRadius: "6px !important",
        width: '50%',
        height: "40px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
        }
    },
}))
