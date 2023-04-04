import { createStyles, ThemeDefine } from "theme";

export const stylesGrantChart = createStyles((theme: ThemeDefine) => ({
    container: {
        // minWidth: 650,
        margin: '0 auto',
        marginTop: 50,
        height: 'calc(100vh - 350px)',
        position: "relative",
        overflowX: 'auto',
        // overflowY: 'hidden',
        '&::-webkit-scrollbar': {
            // width: 5,
            height: 12,
        },
        '&::-webkit-scrollbar-thumb': {
            background: "#E6E6E6",
            borderRadius: '6px',
        },
        ' & .roomName': {
            position: 'sticky',
            left: '0',
            zIndex: 1000,
            backgroundColor: 'white',
            boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.15)",
            '& .roomRow': {
                height: 45,
                border: "1px solid #E3E4E5",
                borderRight: "none",
                borderTop: "none",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: 14,
                padding: 5
            },
            '& .roomName__columns': {
                '&::-webkit-scrollbar': {
                    height: 300,
                    width: 8,
                },
                '&::-webkit-scrollbar-thumb': {
                    background: "#E6E6E6",
                    borderRadius: '6px',
                },
            }
        },
        '& .roomStatus-period': {
            height: 60,
            width: "100%",
            display: "flex",
            alignItems: 'center',
            justifyContent: "space-between",
            backgroundColor: '#F5F5FA',
            fontSize: 14,
            color: '#00293B',
            fontWeight: 'bold',
            position: "sticky",
            top: 0,
            borderRadius: '6px 0px 0px 0px',

        },

        "& .chart-period": {
            display: 'grid',
            position: 'sticky',
            top: 0,
            color: '#00293B',
            fontWeight: 'bold',
            zIndex: 99,
            height: 60,
        },
        '& .chart-period > span': {
            paddingLeft: 5,
            backgroundColor: '#F5F5FA',
            borderRight: "1px solid #E3E4E5",
            // borderLeft: 'none',
        },
        "& .chart-lines": {
            position: "absolute",
            display: 'grid',
            height: "calc(100% - 60px)",
            width: '100%',
            backgroundColor: 'transparent',
        },
        "& .chart-lines > span": {
            borderRight: '1px solid #E3E4E5',
        },
        '& .rowTasks': {
            overflowY: 'scroll',
            '&::-webkit-scrollbar': {
                display: 'none',
            }
        },
        '& li': {
            fontWeight: 450,
            textAlign: 'left',
            fontSize: 15,
            padding: '5px 15px',
            color: '#FFF',
            overflow: 'hidden',
            height: 45,
        },
        '& ul .chart-li-one': {
            fontWeight: 'bold',
        },
        '& ul .reservation': {
            backgroundColor: '#E9F4FB',
            border : "1px solid #E9F4FB",
            borderLeft: '3px solid #1A87D7',
            color: '#1A87D7',
            borderRadius : 6,
        },
        '& ul .checkout': {
            backgroundColor: '#EEF7EE',
            border : "1px solid #EEF7EE",
            borderRadius : 6,
            borderLeft: '3px solid #4CAF50',
            color: '#4CAF50',
        },
        '& ul .outOrder': {

            backgroundColor: '#FFF5E6',
            border : "1px solid #FFF5E6",
            color: '#FF9800',
            borderLeft: '3px solid #FF9800',
            borderRadius : 6,
        },
        '& ul .stayOver': {
            backgroundColor: '#FFEDEE',
            // border : "1px solid "
            color: '#F74352',
            border : "1px solid #FFEDEE",
            borderLeft: '3px solid #F74352',
            borderRadius : 6,
            display: 'flex',
            '& .stayOverNumber': {
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#F74352',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }
        }
    }
}));