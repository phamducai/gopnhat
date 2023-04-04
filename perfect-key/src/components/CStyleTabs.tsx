/* eslint-disable @typescript-eslint/no-explicit-any*/
import { createStyles, ThemeDefine } from 'theme';

export const styleCTabs = createStyles((theme: ThemeDefine) => ({
    customTabs: {
        "&.ant-tabs > .ant-tabs-nav": {
            margin: "0px"
        },
        "& .ant-btn-text": {
            height: "50px !important",
            width: "206px !important",
            borderRadius: "4px 4px 0px 0px",
            fontWeight: 'bold',
            color: '#627b86'
        },
        "& .ant-tabs-tab": {
            height: "50px !important",
            width: "206px !important",
            display: "flex",
            justifyContent: "center",
            margin: "0 2px !important",
            backgroundColor: "#f5f5f6",
            borderRadius: "4px 4px 0px 0px",
        },
        "& .ant-tabs-tab-active": {
            background: "#1A87D7",
        },
        "& .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn": {
            color: '#fff',
            fontWeight: 'bold'
        },
        "& .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn .ant-btn-text": {
            color: '#fff',
            fontWeight: 'bold',
            transition: 'all 0s'
        },
        "& .ant-tabs-tab-btn": {
            color: '#627b86',
            fontSize: "16px",
            fontWeight: 'bold'
        },
        "&.ant-tabs-top > .ant-tabs-nav .ant-tabs-ink-bar": {
            height: "0px"
        },
        "&.ant-tabs-top > .ant-tabs-nav::before": {
            border: 'none !important'
        },
        "& .ant-tabs-content": {
            display: "flex",
            justifyContent: "center",
            marginBottom: '5px !important',
            height: "100%"
        },
        "& .ant-tabs-tabpane": {
            width: "951px"
        }
    },
    customClassBox: {
        padding: "0 !important",
        height: "calc(100% - 6px)"
    }
}))
export const styleCTabsRoomPlan = createStyles((theme: ThemeDefine) => ({
    customTabs: {
        "&.ant-tabs ": {
            '-webkit-box-shadow': '0px 2px 6px 0px rgb(0 0 0 / 10%)',
            background: "#FFFFFF",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            padding: "0 0 0 0px",
            // paddingTop: "0px",
            height: "100%"
        },
        "&.ant-tabs > .ant-tabs-nav": {
            margin: "0px"
        },
        "& .ant-btn-text": {
            height: "50px !important",
            width: "206px !important",
            borderRadius: "4px 4px 0px 0px",
            fontWeight: "600 !important",
            color: '#627b86'
        },
        "& .ant-tabs-tab": {
            height: "40px !important",
            width: "150px !important",
            display: "flex",
            justifyContent: "center",
            margin: "0 2px !important",
            backgroundColor: "#f5f5f6",
            borderRadius: "4px 4px 0px 0px",
        },
        "& .ant-tabs-tab-active": {
            background: "#1A87D7",
        },
        "& .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn": {
            color: '#fff',
            fontWeight: "600 !important",
        },
        "& .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn .ant-btn-text": {
            color: '#fff',
            fontWeight: "600 !important",
            transition: 'all 0s'
        },
        "& .ant-tabs-tab-btn": {
            color: '#627b86',
            fontSize: "14px",
            fontWeight: "600 !important",
        },
        "&.ant-tabs-top > .ant-tabs-nav .ant-tabs-ink-bar": {
            height: "0px"
        },
        "&.ant-tabs-top > .ant-tabs-nav::before": {
            border: 'none !important'
        },
        "& .ant-tabs-content": {
            display: "flex",
            justifyContent: "center",
            marginBottom: '5px !important',
            height: "100%"
        },
        "& .ant-tabs-tabpane": {
            width: "100%"
        }
    }
}))