import { createStyles } from "theme/Theme";

export const modalAddOnGroupRsvn = createStyles((theme) => ({
    inputReservation: {
        background: "#E7E7E7",
    },
    input: {
        background: "#F5F6F7",
        borderRadius: 6,
        border: "1px solid #E7E7E7",
    },
    selectBackground: {
        "& .ant-select-selector": {
            backgroundColor: "#F5F6F7 !important",
            height: "40px !important",
            alignItems: "center !important",
            borderRadius: "6px !important"
        },
        '& .ant-select-arrow': {
            color: "#1A87D7"
        }
    },
    buttonStyle: {
        height: "36px !important",
        padding: "4px 17px !important",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        }
    },
    datePicker: {
        borderRadius: "6px !important",
        height: "40px !important",
        width : "50%",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
        }
    },
    textArea: {
        "& textarea.ant-input":
        {
            height: "100%",
            borderRadius: 6,
            backgroundColor: "#F5F6F7",
        }
    },
    inputNumber: {
        background: "#F5F6F7",
        borderRadius: 6,
        border: "1px solid #E7E7E7",
        '& .ant-input-number-input-wrap':{
            marginTop: "3px"
        }
    },
}))
