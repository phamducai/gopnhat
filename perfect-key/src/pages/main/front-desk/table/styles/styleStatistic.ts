import { createStyles, ThemeDefine } from 'theme'

export const styleStatistic = createStyles((theme: ThemeDefine) => ({
    classBox: {
        background: "#FFFFFF",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        padding: "15px",
        paddingTop: "0px",
        height: "auto",
    },
    customPostion: {
        position: "relative",
    },
    datePicker: {
        borderRadius: "6px !important",
        width: '100%',
        height: "40px !important",
        marginTop: '1rem !important',
        "& .ant-picker-suffix": {
            color: "#1A87D7",
        },
        "& input": {
            opacity: 0,
        }
    },
    datePickerFakeInput: {
        position: "absolute",
        top: "27px",
        left: "10px",
        width: "calc(100% - 20px - 17px)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    table: {
        '& .ant-table-tbody > tr.ant-table-row:hover > td': {
            background: "#FCF3D7",
            fontWeight: "600",
        },
    },
    dataRowText: {
        ".ant-table-tbody &": {
            textAlign: 'center',
            textDecorationLine: 'underline',
            color: '#1A87D7',
        },
        
        ".ant-table-summary &": {
            textAlign: 'center',
            textDecorationLine: 'underline',
            color: '#1A87D7',
        },

        ".ant-table-thead &": {
            fontWeight: "600",
            textAlign: 'center'
        }

    },
    dataDeparture: {
        ".ant-table-summary tr:nth-of-type(4) &": {
            fontWeight: "700",
        },
        ".ant-table-summary tr:nth-of-type(5) &": {
            fontWeight: "700",
        },
        ".ant-table-summary tr:nth-of-type(6) &": {
            fontWeight: "700",
        },
    },
    firstColumn: {
        ".ant-table-row:first-child &": {
            fontWeight: "600",
        },
        ".ant-table-row:nth-child(5) &": {
            fontWeight: "600",
        },
        ".ant-table-row:nth-child(8) &": {
            fontWeight: "600",
        },
        ".ant-table-row:nth-child(9) &": {
            fontWeight: "600",
        },
        ".ant-table-row:last-child &": {
            fontWeight: "600",
        }
    },
}))