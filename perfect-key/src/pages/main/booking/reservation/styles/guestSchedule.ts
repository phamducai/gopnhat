
import { createStyles } from 'theme';

export const styleTableSchedule = createStyles((theme) => ({
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
    table: {
        height: 318,
        "@media (max-width:1024px)": {
            width: 892
        },
        "& .ant-table-tbody > tr > td": {
            padding: "0px 16px !important",
        },
        "& ::-webkit-scrollbar-track": {
            background: "white !important"
        },
        "& ::-webkit-scrollbar": {
            height: 0,
            width: 0
        }
    },
    icon: {
        "& :hover": {
            color: "#1A87D7",
        }
    },
    '& thead > tr > th': {
        background: "#F0F2F5"
    },
    inputEdit: {
        cursor: "pointer",
        "& * :hover ": {
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '5px 35px 5px 0px',
        }
    },
    tableEdit: {
        "& :hover div input": {
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '5px 35px 5px 0px',
        }
    }
})
)