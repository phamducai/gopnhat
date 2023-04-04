import { createStyles } from 'theme'

export const  styleHouseStatus = createStyles((theme) => ({
    classBox: {
        background: "#FFFFFF",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        padding: "15px",
        paddingTop: "0px",
        height: "auto"
    },
    title: {
        fontWeight: "bold",
        fontSize: "20px",
        lineHeight: "27px",
        display: "flex",
        alignItems: "center",
        color: "#00293B soild",
        padding: "9px 0"
    },
    contentText: {
        // fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "19px",
        // color: "#666666",
        marginBottom: "5px",
        fontWeight: "600",
        color: "black"
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
