import { createStyles } from "theme";

export const styleCEndOfDay = createStyles((theme) => ({
    table: {
        width: "100%",
        height: "calc(100% - 40px)",
    },
    borderTable: {
        borderBottom: "1px solid #E3E5E6",
        "&:hover": {
            color: "#fff !important",
            backgroundColor: "#76b2dd",
            opacity: 1,
            "& $tableItemName": {
                color: "#fff"
            }
        }
    },
    text: {
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "16px",
        color: "#00293B",
    },
    tableItemName: {
        color: "#99a9b1",
        fontWeight: "500",
    }
}))