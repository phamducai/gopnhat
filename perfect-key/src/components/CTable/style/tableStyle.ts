import { createStyles, ThemeDefine } from 'theme'

export const tableStyle = createStyles((theme: ThemeDefine) => ({
    collapse: {
        "& .ant-collapse-content > .ant-collapse-content-box": {
            padding: "0px !important"
        },
        "& .ant-collapse-header": {
            paddingBottom: "0px !important",
            paddingLeft: "0px !important"
        },
    },
    bgIconBack: {
        height: "20px",
        width: "20px",
        background: "#e5eaeb",
        borderRadius: "4px"
    },
    breadcrumb: {
        fontWeight: "600",
        fontSize: "20px",
        lineHeight: "47px",
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
    },
    dropDownBtn: {
        borderRadius: "8px",
        backgroundColor: "#1A87D7 !important",
        color: "#FFFFFF",
        fontWeight: "600 !important",
        fontSize: "14px",
        lineHeight: "20px",
        padding: "10px 16px",
        width: "100%"
    },
    dropDown: {
        "& .ant-dropdown-menu": {
            borderRadius: "10px",
            backgroundColor: "#FFF",
        },
        "& li": {
            fontWeight: "600 !important",
            fontSize: "14px",
            padding: "10px 40px 10px 16px",
        }

    },
    classBox: {
        background: "#FFFFFF",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        padding: "15px",
        paddingTop: "0px",
    },
    input: {
        background: "#F5F6F7",
        height: 40,
        borderRadius: 6,
    },
    blueText: {
        color: "#1A87D7",
        fontWeight: "600"
    },
    redText: {
        color: "#F74352",
        fontWeight: "600"
    },
    table: {
        height: "100%",
        '& .ant-table-header': {
            "& .ant-table-cell": {
                color: '#00293B'
            }
        },
        "& .ant-table": {
            borderRadius: "10px !important",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        },
        '& table': {
            //marginTop: '1rem',
            fontSize: "14px",
            lineHeight: "19px",
            color: "#00293B",
            "& .fakeFooter .cellName": {
                paddingLeft: "16px",
            },
        },

        '& thead > tr > th': {
            background: "#F5F5FA",
            fontWeight: "600",
            textAlign: "center"
        },
        '& thead > tr': {
            borderRadius: "10px !important",
        },
        '& thead > tr > th:first-child': {
            borderTopLeftRadius: "10px !important",
        },
        "& .ant-table-tbody > tr": {
            cursor: "default",
            textAlign: "center"
        },
        // "& .ant-table-tbody > tr > td": {
        //     borderBottom: "1px solid #E3E5E6",
        //     height: "40px",
        //     padding: "10px !important",
        // },
        '& .ant-table-tbody > tr.ant-table-row:hover > td': {
            background: "#e8f3fb",
            fontWeight: "600",
        },
        "& ::-webkit-scrollbar": {
            width: "8px",
            height: "12px",
            background: "black",
        },
        "& ::-webkit-scrollbar-track": {
            background: "#F5F5FA"
        },
        "& ::-webkit-scrollbar-thumb": {
            background: "#E6E6E6",
            borderRadius: "6px"
        },
        "& th.ant-table-selection-column": {
            width: "40px !important"
        },
        // "& .ant-table-container": {
        //     flexDirection: "row !important"
        // }
        // "& td.ant-table-cell": {
        //     "&:hover": {
        //         border: "1px solid red"
        //     }
        // }
    },
    rowSelect : {
        background: "#e8f3fb",
        fontWeight: "600",
    },
    inputEdit: {
        cursor: "pointer",
        display: "flex",
        height: "30px",
        width: "100%",
        alignItems: "center",
        justifyContent: "start",
        paddingLeft: "11px",
        paddingTop: "1px",
        "&:hover ": {
            border: '1px solid #d9d9d9',
            borderRadius: '2px',
        }
    },
    classBoxFolio: {
        background: "#F0F6FB !important",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        padding: "15px !important",
        height: '100%'
    },
    trColorGuest: {
        color: "#00293B"
    },
    trColorGuestMain: {
        color: '#1A87D7'
    },
}))