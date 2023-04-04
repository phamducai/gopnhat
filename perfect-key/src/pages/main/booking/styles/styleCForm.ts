import { createStyles } from "theme/Theme";

export const heightSidebar = {
    header: "80px",
    footer: "80px"
}

export const styleCForm = createStyles((theme) => ({
    header: {
        height: heightSidebar.header,
        fontSize: "20px",
        fontWeight: "600",
        color: "#00293B",
        marginLeft: "30px"
    },
    footer: {
        height: heightSidebar.footer
    },
    siderbarForm: {
        height: `calc(${theme.height.fullScreen} - (${theme.height.navbar} + ${heightSidebar.header} + ${heightSidebar.footer}))`,
    },
    rangepicker: {
        height: "40px"
    },
    label: {
        fontSize: "12px",
        lineHeight: "16px",
        color: theme.palette.primary,
    },
    labelInput: {
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "30px",
        color: "#00293B",
    },
    input: {
        background: "#F5F6F7",
        border: "1px solid #E7E7E7",
        borderRadius: "6px",
        height: "40px",
        padding: "0 10px",
        "& .ant-input": {
            background: "#F5F6F7"
        }
    },
    radioGroup: {
        "& .ant-radio-wrapper": {
            marginRight: "0px",
            marginBottom: "0px"
        },
        "& span.ant-radio-checked + *": {
            color: "#1A87D7",
        },
        color: "#00293B",
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
    submitBtn: {
        height: "40px !important",
        marginTop: "20px",
        borderRadius: "8px !important",
        background: "#1A87D7",
        fontWeight: "600 !important",
        width: "100%"
    },
    funcBtn: {
        height: "40px !important",
        marginTop: "20px",
        borderRadius: "8px !important",
        background: "#FFF",
        fontWeight: "600 !important",
        color: "#1A87D7 !important",
        border: "1px solid #1A87D7 !important",
        width: "100%"
    },
    datePicker: {
        height: "40px",
        background: "#F5F6F7 !important",
        borderRadius: "6px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7 !important"
        }
    }

}));