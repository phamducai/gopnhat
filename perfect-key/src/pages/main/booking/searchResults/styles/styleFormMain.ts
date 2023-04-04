import { createStyles } from "theme/Theme";
export const styleFormMain = createStyles((theme) => ({
    title:{
        color: "#1A87D7",
        textTransform: 'uppercase',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    borderColor:{
        borderColor: "#E7E7E7 !important"
    },
    colorLabel:{
        color: '#1A87D7'
    },
    datePicker: {
        borderRadius: "6px !important",
        width: '50%',
        height: "40px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
        }
    },
    titleCheckbox: {
        color: "#00293B"
    },
    textArea: {
        "& textarea.ant-input":
        {
            height: "100%",
            borderRadius: 6,
            backgroundColor: "#F5F6F7",
        }
    }
}));