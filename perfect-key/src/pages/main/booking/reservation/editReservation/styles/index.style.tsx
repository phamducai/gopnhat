import { createStyles,ThemeDefine } from 'theme';
export const styleEditReservation = createStyles((theme) => ({
    main: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    backSquare: {
        background: "#e2e7ea",
        borderRadius: 4,
    },
    buttonHeaderRight: {
        boxShadow: "0px 2px 6px rgba(8, 35, 48, 0.2), 0px 1px 2px rgba(8, 35, 48, 0.24)"
    },
    headerInfo: {
        "& span": {
            color: "#00293B"
        },
        "& .ant-radio-group": {
            fontWeight: 600
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
    buttonFooterLeft: {
        padding: "16px",
        height: "40px !important",
        width: 100,
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
    buttonFooterRight: {
        height: "40px !important",
        padding: "16px",
        marginLeft: 10,
        "& span": {
            fontWeight: "600 !important",
        }
    },
    buttonSubmit: {
        height: "40px !important",
        lineHeight: "20px",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        }
    },
    dropDownBtn: {
        background: "#EBEBEB",
        opacity: 1,
        boxShadow: "0px 2px 6px rgba(8, 35, 48, 0.2), 0px 1px 2px rgba(8, 35, 48, 0.24) !important",
        paddingTop: 18,
        paddingBottom: 18,
        height: 60,
        width: 206,
        "@media (max-width:1024px)": {
            width: 142
        },
        "& i": {
            display: "none"
        },
        "& .ant-menu-submenu": {
            "& div": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: "16px",
                color: "rgb(0, 41, 59)",
                // height: "80px !important"
            }
        },
    },
    datePicker: {
        borderRadius: "6px !important",
        height: "40px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
        }
    },
    buttonHeaderRightActive: {
        background: "white",
        boxShadow: "0px 2px 6px rgba(8, 35, 48, 0.2), 0px 1px 2px rgba(8, 35, 48, 0.24)",
        paddingTop: 18,
        paddingBottom: 18,
        width: 206,
        "@media (max-width:1024px)": {
            width: 142
        }
    },
}));
export const styleCTableFixCharge = createStyles((theme:ThemeDefine) => ({
    classBoxFixCharge : {
        background: "#FFFFFF",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        paddingTop: "0px",
        height: "100%",
    },
    radioGroup: {
        "& .ant-radio-wrapper": {
            marginRight: "0px",
            marginBottom: "0px"
        },
        "& span.ant-radio-checked + *": {
            color: "#1A87D7",
        },
        "& span": {
            fontSize: 12,
        },
        color: "#00293B",
    },
    table:{
        maxHeight: "45vh"
    },
    title: {
        color: "#00293B",
        textTransform: 'uppercase',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    textColor: {
        color: "#00293B",
        fontSize: 12,
        fontWeight: "bold"
    },
    titleColor : {
        color: "#00293B"
    }
}));

export const styleInput = createStyles((theme) => ({
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
    buttonStyle: {
        height: "36px !important",
        padding: "4px 17px !important",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        }
    }
}))