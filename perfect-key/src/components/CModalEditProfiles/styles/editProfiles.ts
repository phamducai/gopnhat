import { createStyles } from "theme/Theme";

export const editProfilesStyle = createStyles((theme) => ({
    modal: {
        top: 25,
        maxHeight: 'calc(100vh - 50px)',
        "& .ant-modal-content": {
            overflowY: "auto",
            maxHeight: "calc(100vh - 50px)",
            borderRadius: "6px",
        },
        "& ::-webkit-scrollbar": {
            width: "8px",
            height: "12px",
        },
        "& ::-webkit-scrollbar-track": {
            borderRadius: "0 6px 6px 0",
            background: '#fff'
        },
        "& ::-webkit-scrollbar-thumb": {
            background: "#E6E6E6",
            borderRadius: "6px"
        },
    },
    input: {
        borderRadius: 6,
        border: "1px solid #E7E7E7",
        height: 40
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
    table: {
        boxShadow: "0px 2px 6px rgb(0 0 0 / 10%)",
        "& .ant-table tfoot > tr > td": {
            padding: 0,
        },
        '& .ant-checkbox-inner': {
            border: "1px solid #00293B",
            borderRadius: "2px"
        },
        '& .ant-table-thead': {
            "& .ant-table-cell": {
                textAlign: "center",
                padding: 0,
                height: 40
            }
        },
        "& .tableBooking .ant-table-container::before": {
            boxShadow: 'none !important'
        },
        "& .ant-table-container": {
            height: "100%"
        },
        "& .ant-table-content": {
            height: "100%"
        },
        "& .ant-table-content > table": {
            height: "100%"
        },
        '& table': {
            fontSize: "14px",
            lineHeight: "19px",
            color: "#00293B",
            "& .ant-table-summary": {
                position: 'inherit',
                bottom: '50px',
                '@supports (-moz-appearance:none)': {
                    bottom: '0px !important'
                }
            },
        },
        '& thead > tr': {
            borderRadius: "20px",
        },
        '& thead > tr > th': {
            background: "#F5F5FA",
            fontWeight: "600",
            color: '#00293B !important'
        },
        "& .ant-table-tbody > tr": {
            cursor: "default"
        },
        "& .ant-table-tbody > tr > td.ant-table-cell": {
            borderBottom: "1px solid #E3E5E6",
            height: "40px !important",
            padding: "0 !important",
            fontWeight: 400,
        },
        '& .ant-table-tbody > tr.ant-table-row:hover > td': {
            background: "#e8f3fb",
            fontWeight: "600",
        },
        "& ::-webkit-scrollbar": {
            width: "8px",
            height: "12px",
            background: "black"
        },
        "& ::-webkit-scrollbar-track": {
            background: "#F5F5FA"
        },
        "& ::-webkit-scrollbar-thumb": {
            background: "#E6E6E6",
            borderRadius: "6px"
        }, 
        "& .ant-table-pagination": {
            paddingRight: 10
        }
    },
    bigButton: {
        background: "white",
        boxShadow: "0px 4px 10px rgba(8, 35, 48, 0.1)",
        paddingTop: 18,
        paddingBottom: 18,
        marginBottom: 8,
        width: "calc(100% - 8px)"
    },
    smallButton: {
        background: "white",
        color: '#1A87D7',
        boxShadow: "0px 4px 10px rgba(8, 35, 48, 0.1)",
        paddingTop: 9,
        paddingBottom: 9,
        marginBottom: 8,
        width: "calc(100% - 8px)",
        fontWeight: 700
    },
    buttonFooterLeft: {
        height: "40px !important",
        padding: "0 10px",
        marginRight: 10,
        boxShadow: "0px 2px 6px rgba(8, 35, 48, 0.2), 0px 1px 2px rgba(8, 35, 48, 0.24) !important",
        borderRadius: "4px !important",
        "& span": {
            color: "#00293B",
            fontWeight: "600 !important",
            fontSize: 16,
        }
    },
    buttonFooterRight: {
        height: "40px !important",
        marginLeft: 10,
        "& span": {
            fontWeight: "600 !important",
        }
    },
    hoverButtonFooter: {
        color: "#1A87D7",
        "& span": {
            color: "#1A87D7",
        }
    },
    datePicker: {
        borderRadius: "6px !important",
        width: '100%',
        height: "40px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
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
    btn: {
        borderRadius: "8px",
        backgroundColor: "#1A87D7",
        color: "#FFFFFF",
        fontWeight: "600 !important",
        fontSize: "14px",
        lineHeight: "20px",
        padding: "10px 16px",
        width: "100%"
    },
}))
