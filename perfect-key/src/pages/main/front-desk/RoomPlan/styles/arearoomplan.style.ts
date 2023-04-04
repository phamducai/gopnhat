import { createStyles } from "theme/Theme";



export const styleAreaRoomPlan = createStyles((theme) => ({
    roomBody: {
        padding: '0 !important'
    },
    header: {
        height: "40px",
        color: "#00293B"
    },
    titleRoomPlan: {
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
        backgroundColor: "#EBEBEB",
        color: "#00293B",
        fontWeight: "600 !important",
        fontSize: "14px",
        lineHeight: "20px",
        padding: "10px 16px",
    },
    titleRoomPlanActive: {
        backgroundColor: "#1A87D7 !important",
        color: "#FFFFFF",
    },
    backOrNextBtn: {
        width: "30px",
        height: "30px",
        backgroundColor: "#FFFFFF",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer"
    },
    btnActive: {
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
        backgroundColor: "#1A87D7 !important",
        color: "#FFFFFF",
        fontWeight: "600 !important",
        fontSize: "14px",
        lineHeight: "20px",
        padding: "10px 16px",
        width: "150px",
        flex: "none"
    },
    btn: {
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
        backgroundColor: "#EBEBEB",
        color: "#00293B",
        fontWeight: "600 !important",
        fontSize: "14px",
        lineHeight: "20px",
        padding: "10px 16px",
        width: "150px",
        flex: "none"
    },
    animationRow: {
        transition: "0.3s all"
    },
    checkBox: {
        height: '30px',
        fontSize: "14px",
        '& span.ant-checkbox-inner': {
            border: '1px solid #00293B',
        }
    },
    styleColor:{
        '& label': {
            color: '#666666',
            '& span': {
                color: '#00293B',
                fontWeight: "600 !important",
            }
        }
    },
    styleCardContent:{
        height: "calc(100vh - 420px)",
        gridAutoRows: "180px"
    },
    styleItemCard: {
        borderRadius: "6px",
        border: "1px solid #E7E7E7",
        cursor: 'grab',
        '& .top-item-card': {
            height: "30px",
            backgroundColor: "#F5F6F7",
            paddingLeft: "5px",
            paddingRight: "10px",
            gridTemplateColumns: "14% 76% 10%",
            "& .room-name": {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                paddingLeft: "3px",
                paddingRight: "3px",
            },
            "& .style-number-guest": {
                paddingLeft: "5px !important"
            },
            '& .ant-checkbox-group': {
                textAlign: "end !important"
            }
        },
        '& .content-item-card':{
            height: "110px",
            padding: "5px 10px 5px 10px",
            '& p': {
                fontSize: "12px",
                color: '#666666',
                '& span': {
                    color: '#00293B',
                    fontWeight: "600 !important",
                }
            },
            '& span': {
                color: "#666666",
                fontWeight: "600 !important",
            },
            '& .no-info': {
                fontSize: "14px",
                color: '#00293B',
                fontWeight: "600 !important",
                opacity: 0.2
            }
        },
        '& .footer-item-card':{
            height: "40px",
            padding: "0px 10px 5px 10px",
            '& .ant-tag': {
                display: 'flex !important',
                lineHeight: "30px !important",
                border: "none",
                borderLeft: "3px solid",
                borderRadius: "4px",
                fontWeight: "bold",
                '& .fixed-icon': {
                    marginTop: "0.5rem"
                }
            }
        },
    },
    styleDargZoom: {
        width: "120px",
        height: "32px",
        position: '-webkit-sticky',
        right: "1rem",
        bottom: "8rem",
        "& button": {
            width: "32px",
            height: "32px",
            marginRight : "0.1em",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            boxShadow: "1px 0px 4px 2px rgba(0, 0, 0, 0.15)"

        }
    },
    footerCardRoomPlan: {
        height: "4rem",
        backgroundColor: "#F2F3F4",
        borderRadius: '8px',
    },
    customPopoFilter: {
        "& .ant-popover-arrow": {
            width: "15.485281px",
            height: "15.485281px",
            "& span": {
                width: "15px",
                height: "15px",
            }
        },
        "& .ant-popover-inner": {
            borderRadius: "6px"
        }
    }
}));