import { createStyles, ThemeDefine } from 'theme'

export const styleCashier = createStyles((theme: ThemeDefine) => ({
    cashierTitle: {
        color: "#00293B",
        opacity: 0.4,
    },
    inHouseItemBox: {
        maxHeight: 46,
        color: "white",
        padding: "2px 10px",
        marginBottom: 5,
    },

    cashierRightProcess: {
        position: "relative",
        height: 20,
        backgroundColor: "#E3E5E5",
        fontSize: 12,
        paddingLeft: 10,
        paddingTop: 1,
        borderRadius: 4,
        fontWeight: "bold",
        color: "white"
    },
    cashierRightProcessChild: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
        height: 20,
        borderRadius: 4,
        padding: {
            top: 1,
            left: 10,
        },
        backgroundColor: "#ADADAD",
    }
}))