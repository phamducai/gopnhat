import { createStyles } from "theme/Theme";
export const styleSearchResults = createStyles((theme) => ({
    label: {
        color: "#00293B"
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
    btn: {
        borderRadius: "8px",
        backgroundColor: "#1A87D7",
        color: "#FFFFFF",
        fontWeight: "600 !important",
        fontSize: "14px",
        lineHeight: "20px",
        padding: "10px 16px",
        width: "190px"
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
    subTitle: {
        color: "#ADADAD"
    },
    checkBox: {
        height: '30px',
        fontSize: "16px",
        color: "#00293B",
        '& span.ant-checkbox-inner': {
            border: '1px solid #00293B',
        }
    },
    btnDanger: {
        '&.ant-btn': {
            border: '1px solid #F74352 !important',
            '& span': {
                color: '#F74352 !important'
            }
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
                color: '#1A87D7',
                padding: '8px 16px',
                fontWeight: 600,
                fontSize: '14px'
            }
        }
    },
    styleModel: {
        border: '1px solid #1A87D7',
        boxSizing: 'border-box',
        borderRadius: '6px'
    },
    text: {
        color: '#00293B'
    },
    borderContent: {
        border: "1px solid #E7E7E7",
        borderRadius: "6px",
        padding: "0.7rem"
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
        // padding: "16px",
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
        // // padding: "16px",
        marginLeft: 10,
        "& span": {
            fontWeight: "600 !important",
        }
    },
    buttonSubmit: {
        height: "38px !important",
        lineHeight: "20px",
        borderRadius: "6px !important",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        }
    },
    stylePanigation : {
        backgroundColor: '#FFFFFF',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.1)",
        borderBottomLeftRadius: '6px',
        borderBottomRightRadius: '6px',
        '& .ant-pagination' : {
            display : 'flex',
            alignItems : 'center',
            "& .ant-pagination-prev" : { 
                "& .ant-pagination-item-link" : {
                    lineHeight : "10px"
                }
            },
            "& .ant-pagination-next" : {
                "& .ant-pagination-item-link" : {
                    lineHeight : "10px"
                }
            }
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
    datePickerGroup: {
        borderRadius: "6px !important",
        width: '43%',
        height: "40px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
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
}));


