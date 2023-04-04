/*eslint no-dupe-keys: "error"*/
import { createStyles } from 'theme';

export const styleCTable = createStyles((theme) => ({
    // position: "relative",
    // float: "left"
    tag: {
        "& .ant-tag-close-icon > svg": {
            marginTop: "-4px",
            marginLeft: '7px',
            color: 'black'
        }
    },
    tableFooter: {
        "& td": {
            background: '#e8f3fb !important',
            height: '40px',
            borderBottom: '1px solid #E3E5E6'
        },
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
        '& .ant-table-header': {
            "& .ant-table-cell": {
                color: '#00293B !important',
                cursor: "pointer"
            }
        },
        "& .tableBooking .ant-table-container::before": {
            boxShadow: 'none !important'
        },
        '& table': {
            fontSize: "14px",
            lineHeight: "19px",
            color: "#00293B",
            "& .fakeFooter .cellName": {
                paddingLeft: "16px",
            },
            "& .fakeFooter .cell": {
                background: '#fff',
                height: '40px',
                borderBottom: '1px solid #E3E5E6'
            },
            "& .ant-table-summary": {
                position: 'inherit',
                bottom: '50px',
                '@supports (-moz-appearance:none)': {
                    bottom: '0px !important'
                }
            },

            // css browser gg chrome
            "& .fakeFooter1, .fakeFooter2, .fakeFooter3, .fakeFooter4, .fakeFooter5, .fakeFooter6": {
                '& .cell': {
                    position: 'sticky'
                },
                '&:hover .cell': {
                    backgroundColor: '#e8f3fb !important',
                    fontWeight: 'bold'
                }
            },
            "& .fakeFooter1 .cell": {
                background: '#e8f3fb !important',
                bottom: 'calc(40px * 5)',
                borderTop: '1px solid #E3E5E6',
            },
            "& .fakeFooter2 .cell": {
                bottom: 'calc(40px * 4)',
            },
            "& .fakeFooter3 .cell": {
                bottom: 'calc(40px * 3)',
            },
            "& .fakeFooter4 .cell": {
                bottom: 'calc(40px * 2)',
            },
            "& .fakeFooter5 .cell": {
                bottom: 'calc(40px * 1)',
            },
            "& .fakeFooter6 .cell": {
                bottom: 'calc(40px * 0)',
            }
            //end
        },
        '& thead > tr': {
            borderRadius: "20px",
        },
        '& thead > tr > th': {
            background: "#F5F5FA",
            fontWeight: "600",
            color: '#00293B !important',
            textAlign: "center"
        },
        "& .ant-table-tbody > tr": {
            cursor: "pointer",
            "z-index": "99"
        },
        "& .ant-table-tbody > tr > td": {
            borderBottom: "1px solid #E3E5E6",
            height: "40px",
            padding: "0px !important",
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
        "& th.ant-table-selection-column": {
            width: "40px !important"
        }
    },
    eclipse: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    trRowIttalic : {
        fontStyle : "italic"
    },
    dragGhost: {
        background: "#91d5ff",
        borderRadius: "8px",
        height: "50px",
        width: "fit-content",
    },
    title: {
        padding: '10px',
        paddingLeft: "10px"
    }
}));

export const styleReinstateTable = createStyles((theme) => ({
    tableSummary: {
        color: "#00293B",
        "& .ant-table-cell": {
            padding: "16px 16px !important",
            paddingBottom: "20px !important",
            position: "sticky",
            bottom: 0,
            top: 0,
            zIndex: 4,
            backgroundColor: "white",
        }
    },
    editRowTable: {
        color: "#00293B",
        "& td": {
            borderBottom: "1px solid #E3E5E6",
            height: "40px",
            padding: "0px 16px !important",
        },
    },

    inputEdit: {
        cursor: "pointer"
    },
    table: {
        height: '100%',
        '& .ant-table-header': {
            "& .ant-table-cell": {
                color: '#00293B'
            }
        },
        '& table': {
            //marginTop: '1rem',
            fontSize: "14px",
            lineHeight: "19px",
            color: "#00293B",
            "& .fakeFooter .cellName": {
                paddingLeft: "16px",
            },

            // css browser gg chrome
            "& .fakeFooter1, .fakeFooter2, .fakeFooter3, .fakeFooter4, .fakeFooter5, .fakeFooter6": {
                '& .cell': {
                    position: 'sticky'
                },
                '&:hover .cell': {
                    backgroundColor: '#e8f3fb !important',
                    fontWeight: 'bold'
                }
            },
            "& .fakeFooter1 .cell": {
                background: '#e8f3fb !important',
                bottom: 'calc(40px * 5)',
                borderTop: '1px solid #E3E5E6',
            },
            "& .fakeFooter2 .cell": {
                bottom: 'calc(40px * 4)',
            },
            "& .fakeFooter3 .cell": {
                bottom: 'calc(40px * 3)',
            },
            "& .fakeFooter4 .cell": {
                bottom: 'calc(40px * 2)',
            },
            "& .fakeFooter5 .cell": {
                bottom: 'calc(40px * 1)',
            },
            "& .fakeFooter6 .cell": {
                bottom: 'calc(40px * 0)',
            }
            //end
        },
        '& thead > tr': {
            borderRadius: "20px",
        },
        '& thead > tr > th': {
            background: "#F5F5FA",
            fontWeight: "600",
        },
        "& .ant-table-tbody > tr": {
            cursor: "default"
        },
        // "& .ant-table-tbody > tr > td": {
        //     borderBottom: "1px solid #E3E5E6",
        //     height: "40px",
        //     padding: "0px !important",
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
    },
    selectedRow: {
        background: "#e8f3fb",
        fontWeight: "600",
    }
}));
export const styleUnassignTable = createStyles((theme) => ({
    classBox: {
        background: "#FFFFFF",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1) !impotant",
        borderRadius: "10px",
        paddingTop: "0px",
        height: "100%"
    },
    classBoxTitle: {
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "16px",
        textTransform: "uppercase",
        color: "#00293B",
        display: "flex",
        alignItems: "center",
        paddingTop: 10,
    },
    tableSummary: {
        color: "#00293B",
        "& .ant-table-cell": {
            padding: "16px 16px !important",
            paddingBottom: "20px !important",
            position: "sticky",
            bottom: 0,
            top: 0,
            zIndex: 4,
            backgroundColor: "white",
        }
    },
    editRowTable: {
        color: "#00293B",
        "& td": {
            borderBottom: "1px solid #E3E5E6",
            height: "40px",
            padding: "0px 16px !important",
        },
    },

    inputEdit: {
        cursor: "pointer"
    },
    table: {
        height: `calc(${theme.height.fullScreen} - (35 + ${theme.height.navbar} + 250px))`,
        '& .ant-table-header': {
            "& .ant-table-cell": {
                color: '#00293B'
            }
        },
        '& table': {
            //marginTop: '1rem',
            fontSize: "14px",
            lineHeight: "19px",
            color: "#00293B",
            "& .fakeFooter .cellName": {
                paddingLeft: "16px",
            },

            // css browser gg chrome
            "& .fakeFooter1, .fakeFooter2, .fakeFooter3, .fakeFooter4, .fakeFooter5, .fakeFooter6": {
                '& .cell': {
                    position: 'sticky'
                },
                '&:hover .cell': {
                    backgroundColor: '#e8f3fb !important',
                    fontWeight: 'bold'
                }
            },
            "& .fakeFooter1 .cell": {
                background: '#e8f3fb !important',
                bottom: 'calc(40px * 5)',
                borderTop: '1px solid #E3E5E6',
            },
            "& .fakeFooter2 .cell": {
                bottom: 'calc(40px * 4)',
            },
            "& .fakeFooter3 .cell": {
                bottom: 'calc(40px * 3)',
            },
            "& .fakeFooter4 .cell": {
                bottom: 'calc(40px * 2)',
            },
            "& .fakeFooter5 .cell": {
                bottom: 'calc(40px * 1)',
            },
            "& .fakeFooter6 .cell": {
                bottom: 'calc(40px * 0)',
            }
            //end
        },
        '& thead > tr': {
            borderRadius: "20px",
        },
        '& thead > tr > th': {
            background: "#F5F5FA",
            fontWeight: "600",
        },
        "& .ant-table-tbody > tr": {
            cursor: "pointer",
            "z-index": "99"
        },
        // "& .ant-table-tbody > tr > td": {
        //     borderBottom: "1px solid #E3E5E6",
        //     height: "40px",
        //     padding: "0px !important",
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
        "& .ant-table-container": {
            flexDirection: "row !important",
            "& .ant-table-content": {
                width: "100%"
            }
        }
    },
    selectedRow: {
        background: "#e8f3fb",
        fontWeight: "600",
    },
    dragGhost: {
        background: "#91d5ff",
        borderRadius: "8px",
        height: "40px",
        width: "fit-content",
    },
    title: {
        padding: '10px',
        paddingLeft: "10px"
    }
}));
