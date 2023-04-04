import { createStyles } from "theme";

export const styleCorrection = createStyles((theme) => ({
    buttonStyle: {
        height: "36px !important",
        padding: "4px 17px !important",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        }
    },
    labelInput: {
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "30px",
        color: "#00293B",
    },
    titleStyle: {
        color: "#00293B",
        fontWeight: 600,
        fontSize: "16px",
    },
    antModalStyle: {
        "& .ant-modal-content": {
            overflow: "auto",
            borderRadius: "6px",
        },
        "& .ant-modal-close-x": {
            display: "flex",
            justifyContent: "center",
        },
    },
    buttonFooterLeft: {
        padding: "10px auto",
        width: 100,
        height: "36px !important",
        marginRight: 10,
        boxShadow: "0px 2px 6px rgba(8, 35, 48, 0.2), 0px 1px 2px rgba(8, 35, 48, 0.24) !important",
        borderRadius: "4px !important",
        "& span": {
            color: "#00293B",
            fontWeight: "600 !important",
            fontSize: 16,
        }
    },
    buttonFooterLeftDisable: {
        backgroundColor: '#F5F6F7 !important',
        color: '#acb9bf !important',
        boxShadow: 'none !important',
        "&.ant-btn[disabled], .ant-btn[disabled]:hover, .ant-btn[disabled]:focus, .ant-btn[disabled]:active": {
            border: "none !important"
        },
        "& .btn": {
            color: '#00293B',
            opacity: '0.3',
            fontWeight: '600',
            fontSize: '16px',
            lineHeight: '20px'
        }
    },
    title: {
        color: '#00293B'
    },
    inputReservation: {
        background: "#E7E7E7",
    },
    input: {
        background: "#F5F6F7",
        borderRadius: 6,
        border: "1px solid #E7E7E7",
    },
    inputNumber: {
        background: "#F5F6F7",
        borderRadius: 6,
        border: "1px solid #E7E7E7",
        '& .ant-input-number-input-wrap': {
            marginTop: "3px"
        }
    },
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
    btnStyle: {
        height: "40px !important",
        padding: "4px 15px !important",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        },
        marginTop: "1.36rem"
    },
    textArea: {
        "& textarea.ant-input":
        {
            height: "100%",
            borderRadius: 6,
            backgroundColor: "#F5F6F7",
        }
    },
    selectBackgroundTest: {
        "& .ant-select-selector": {
            backgroundColor: "#F5F6F7 !important",
            borderRadius: "4px !important",
            minHeight: "40px !important",
            display: "flex",
            alignItems: "center",
        },
        '& .ant-select-arrow': {
            color: "#1A87D7"
        }
    },
    // buttonStyle: {
    //     height: "40px !important",
    //     padding: "2px 8px !important",
    //     "& span": {
    //         fontWeight: "600 !important",
    //         fontSize: 14,
    //     }
    // },
    datePicker: {
        borderRadius: "6px !important",
        height: "40px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
        }
    },
    titleCheckbox: {
        color: "#00293B"
    },
    styleCheckbox: {
        '& .ant-checkbox-wrapper': {
            '& span': {
                paddingRight: '2px !important'
            }
        }
    },
    tab: {
        '& .ant-tabs-nav .ant-tabs-tab-active': {
            color: "#1a87d7",
            fontWeight: "bold",
            '& .ant-tabs-tab-btn': {
                color: "#1a87d7"
            }
        },
        '& .ant-tabs-top > .ant-tabs-nav, .ant-tabs-bottom > .ant-tabs-nav':{
            margin:"0 0 6px 0"
        }

    },
    radioGroupStatus: {
        "& .ant-radio-wrapper": {
            marginRight: "0px",
            marginBottom: "0px",
            width: '50%',
            height: '85%'
        },
        "& span.ant-radio-checked + *": {
            color: "#1A87D7",
        },
        "& span": {
            fontSize: 14,
        },
        color: "#00293B",
        height: '75%'
    },
    radioGroup: {
        "& .ant-radio-wrapper": {
            marginRight: "0px",
            marginBottom: "0px",
        },
        "& span.ant-radio-checked + *": {
            color: "#1A87D7",
        },
        "& span": {
            fontSize: 14,
        },
        color: "#00293B",
    },
}));