import { createStyles } from "theme/Theme";

export const styleStatistic = createStyles((theme) => ({
    statisticMain: {

    },
    statisticTable: {
        "&::-webkit-scrollbar": {
            height: "4px !important",
        },
    },
    fontTH: {
        "& .ant-table-thead": {
            fontWeight: 600,
        },
    },
    datePicker: {
        borderRadius: "6px !important",
        width: '50%',
        height: "40px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
        }
    },
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
                position: 'sticky',
                bottom: '0px',
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
            color: '#00293B !important'
        },
        "& .ant-table-tbody > tr": {
            cursor: "default"
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
            widht: "40px !important"
        }
    }
}))