import { createStyles, ThemeDefine } from "theme";

export const styles = createStyles((theme: ThemeDefine) => ({
    button: {
        color: "white !important",
        backgroundColor: '#1A87D7 !important',
        marginRight: 20,
    },
    cointainer: {
        '& .rangePicker': {
            "& .ant-picker": {
                padding: "0px !important",
                borderRadius: "6px",
                width: "100%",
                height: "40px",
            },
            "& .ant-picker-input": {
                background: "#F5F6F7",
                width: "100% !important",
                height: "38px !important",
                padding: "0 10px",
                borderRadius: "6px",
            },
            "& .ant-picker-suffix": {
                color: "#1A87D7",
            },
            "& .ant-picker-clear": {
                right: "10px !important"
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
        },
        ' & p': {
            marginBottom: "5px !important",
            color: '#00293B',
            fontSize: 12,
            fontWeight: 'bold',
        },

        '& .ant-input-affix-wrapper': {
            background: '#F5F6F7',
            border: '1px solid #E7E7E7',
            borderRadius: 6,
            minHeight: 40,
        },
        '& .ant-input': {
            background: '#F5F6F7',
            // marginTop : 10,
        },
        '& .ant-btn': {
            marginRight: 10,
            color: '#00293B',
            fontWeight: 'bold',
            background: '#F0F2F5',
            border: '1px solid #E7E7E7',
            borderRadius: 8,
            height: 40,
        },
        '& .ant-select': {
            display: 'block !important',
        },
        '& .ant-select-selector': {
            backgroundColor: '#F5F6F7 !important',
            border: '1px solid #E7E7E7',
            borderRadius: '6px !important',
            minHeight: 40,
        },
        '& .ant-select-selection-item': {
            display: "flex",
            alignItems: "center",
        },
        '& .ant-picker': {
            height: 40,
        },
    },
    footer: {
        position: "fixed",
        left: 0,
        bottom: -20,
        width: "100%",
        height: 130,
        "& .footerLeft": {
            position: "sticky",
            left: 0,
            backgroundColor: "white",
        },
        '& .chart-row':
        {
            width: "100%",
            border: '1px solid #E3E4E5',
            '& .chart-symbols': {
                gridGap: '20px 50px',
            },
            '& .chart-lines': {
                padding: "0px 30px",
                height: "100%",
                overflow: "auto",
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                '& span': {
                    borderLeft: '1px solid #E3E4E5',
                }
            },
            '& .outOrder': {
                backgroundColor: '#FFF5E6',
                color: '#FF9800',
                borderLeft: '3px solid #FF9800',
                height: '30px',
                width: "15%"
            },
            '& .checkout': {
                backgroundColor: '#EEF7EE',
                borderLeft: '3px solid #4CAF50',
                color: '#4CAF50',
                height: '30px',
                width: "15%"
            },
            '& .reservation': {
                backgroundColor: '#E9F4FB',
                borderLeft: '3px solid #1A87D7',
                color: '#1A87D7',
                height: '30px',
                width: "15%"
            },
            '& .stayOver': {
                backgroundColor: '#FFEDEE',
                color: '#F74352',
                borderLeft: '3px solid #F74352',
                height: '30px',
                width: "15%"
            }
        }

    },
    //break point
    input: {
        "@media(min-width:1700px)": {
            width: 150,
        },
    },
    select: {
        '@media(min-width:1700px)': {
            width: 300
        }
    }
}));