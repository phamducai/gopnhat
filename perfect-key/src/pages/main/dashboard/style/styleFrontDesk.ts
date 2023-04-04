import { createStyles } from 'theme'

export const styleFrontDeskDashBoard = createStyles((theme) => ({
    title: {
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "16px",
        display: "flex",
        alignItems: "center",
        color: "#00293B",
        opacity: "0.4",
        padding: "9px 0"
    },
    contentText: {
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "19px",
        color: "#666666",
        marginBottom: "5px"
    },
    contentTextBold: {
        fontWeight: "600",
        color: "black"
    },
    progressParent: {
        height: "20px",
        background: "#E3E5E5",
        borderRadius: "4px",
        position: "relative",
        bottom: "-11px"
    },
    progressChild: {
        height: "20px",
        background: "#ADADAD",
        borderRadius: "4px",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "16px",
        paddingLeft: "10px"
    },
    btn: {
        background: "#1A87D7",
        width: "100%",
        '&:hover': {
            background: "#078aea",
        }
    }
}))