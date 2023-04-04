import { createStyles,ThemeDefine } from 'theme';
export const styleNewWalkIn = createStyles((theme) => ({
    main: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    commet:{
        
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
    }
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