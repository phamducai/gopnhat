import { createStyles, ThemeDefine } from 'theme';

export const styleButtonDropdown = createStyles((theme: ThemeDefine) => ({
    frontDeskControl: {
        height: "40px",
        background: "#ffffff",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1) !important",
        borderRadius: "4px",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "600",
        fontSize: "14px",
        lineHeight: "19px",
        "& .ant-btn":{
            border: 'none'
        },
        "& .ant-menu-vertical .ant-menu-submenu-title": {
            height: "120px",
            lineHeight: "14px",
            marginTop: "0 !important",
            marginBottom: "0 !important",
            color: "#1a87d7",
            padding: '0 !important',
        },
        "& .ant-menu-vertical .ant-menu-submenu-title span": {
            
            marginLeft: '20px !important',
        },
        "& .ant-menu-vertical" : {
            borderRight: "transparent",
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        
        },
        "& .ant-menu-vertical .ant-menu-item .ant-menu-vertical-left .ant-menu-item .ant-menu-vertical-right .ant-menu-item .ant-menu-inline .ant-menu-item .ant-menu-vertical .ant-menu-submenu-title:active .ant-menu-vertical-left .ant-menu-submenu-title:active .ant-menu-vertical-right .ant-menu-submenu-title:active .ant-menu-inline .ant-menu-submenu-title:active"
        : {
            backgroundColor: "#e7e7e7",
            marginTop: "0 !important",
            marginBottom: "0 !important",
        },
        "& .ant-menu-vertical .ant-menu-item" :{
            lineHeight: '30px',
            marginTop: "0 !important",
            marginBottom: "0 !important",
        },
        "& 	.ant-menu-submenu-arrow" : {
            display: "none"
        }
        
    },
    controlColorBlue: {
        "& span":{
            color: "#1a87d7 !important",
            fontWeight: "bold",
            marginLeft: 20
        },
        "& button:first-child": {
            width: "100%",
        },
    },
    AntBtnGroup: {
        "& > .ant-btn-group" : {
            marginLeft: '12px !important',
        },
        "& .customer-icon" : {
            "&:after" : {
                fontSize: "21px",
                position: 'absolute',
                left: '95%',
                color: 'black',
            }
        }
    },
    controlDropdown: {
        background: "#ffffff",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        fontSize: "14px",
        lineHeight: "25px",
        width: "120px",
        height: "calc(100vh - 80%)",
        "& .ant-btn":{
            border: 'none'
        },
        "& li": {
            fontWeight: "700",
        },
        "& li:hover": {
            background: "#ffffff",
        },
        "& li span:hover": {
            color: "#1a87d7",
        }
    },
    controlSubMenu : {
        "& ul " : {
            borderRight: "transparent",
            height: "100%",
            minWidth: "145px !important",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        },
        
        "& .ant-menu-vertical .ant-menu-item .ant-menu-vertical-left .ant-menu-item .ant-menu-vertical-right .ant-menu-item .ant-menu-inline .ant-menu-item .ant-menu-vertical .ant-menu-submenu-title:active .ant-menu-vertical-left .ant-menu-submenu-title:active .ant-menu-vertical-right .ant-menu-submenu-title:active .ant-menu-inline .ant-menu-submenu-title:active"
        : {
            backgroundColor: "#e7e7e7",
            marginTop: "8 !important",
            marginBottom: "8 !important",
        },
        "& .ant-menu-vertical .ant-menu-item" :{
            height: '35px',
            lineHeight: '30px',
            marginTop: "8 !important",
            marginBottom: "8 !important",
        },
        "& 	.ant-menu-submenu-arrow" : {
            display: "none"
        },
    },
    datePicker: {
        borderRadius: "6px !important",
        height: "40px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
        }
    },
}))