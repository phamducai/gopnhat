import { createStyles, ThemeDefine } from 'theme'

export const styleReport = createStyles((theme: ThemeDefine) => ({
    btn: {
        background: "#1A87D7",
        width: "100%",
        '&:hover': {
            background: "#078aea",
        }
    },
    dropDownBtn: {
        borderRadius: "6px !important",
        backgroundColor: "#FFFFFF !important",
        boxShadow: "0px 0px 3px rgb(233,227,227) !important",
        "& i": {
            display: "none"
        },
        "& .ant-menu-submenu": {
            "& div": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: "16px",
                color: "#1A87D7",
                height: "80px !important"
            },
            
        },
        "& .ant-menu-submenu-title": {
            marginTop: 0,
            marginBottom: 0
        },
        "&:after" : {
            fontSize: "30px !important",
            position: 'absolute',
            left: '95%',
            color: 'black',
            top: "50%"
        }
    },
    popupMenu : {
        "& ul": {
            height: "calc(100vh - 430px)",
            
        }
    },
}))