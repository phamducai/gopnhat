import { createStyles } from 'theme'
export const styleReservation = createStyles((theme) => ({
    main: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    classBox: {
        background: "#FFFFFF",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        padding: "15px",
        paddingTop: "0px",
        height: "auto",
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
    customAutoComplete: {
        "& .ant-select-selector": {
            "&:hover": {
                border: "none"
            }
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
    viewBtn: {
        "&": {
            borderRadius: "40px",
            background: "none"
        }
    },
    buttonRooms: {
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px'
    },
    tableUnAssignRoom: {
        "& .ant-table-container": {
            marginTop: "1rem"
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
                padding: '8px 8px',
                fontWeight: 600,
                fontSize: '14px'
            }
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
    menuBtn: {
        backgroundClip: 'padding-box',
        backgroundColor: '#ffffff',
        border: '1px',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        left: '0px',
        listStyleType: 'none',
        margin: 0,
        outline: 'none',
        padding: 0,
        position: 'absolute',
        textAlign: 'left',
        top: '0px',
        // height: '300px',
        '-webkit-box-shadow': '0 2px 8px rgba(0, 0, 0, 0.15)',
        '& li' : {
            clear: 'both',
            color: 'rgba(0, 0, 0, 0.65)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'normal',
            lineHeight: '22px',
            margin: 0,
            padding: 0,
            /* padding: 5px 12px; */
            /* transition: all 0.3s; */
            whiteSpace: 'nowrap',
            /* -webkit-transition: all 0.3s; */
        },
        '& li:hover': {
            backgroundColor: '#e6f7ff'
        }
    },
    menuItem: {
        width: '100%',
        margin: 0,
        height: '40px',
        
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
}))