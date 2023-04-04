import { createStyles, ThemeDefine } from 'theme';

export const styles = createStyles((theme: ThemeDefine) => ({
    box: {
        width: "311px",
        marginTop: 6,
        borderRadius: 10
    },
    avt: {
        width: 60,
        height: 60
    },
    center: {
        display: 'flex',
        alignItems: 'center',
        '& svg': {
            fontWeight: 'bold',
            color: '#ADADAD',
            fontSize: 14
        }
    },
    btn: {
        background: "#1A87D7",
        width: "100%",
        '&:hover': {
            background: "#078aea",
        }
    },
    btnDanger: {
        color: "#F74352",
        border: "1px solid #F74352",
        width: "100%"
    },
    hover: {
        '&:hover': {
            background: 'white !important',
            cursor: 'default'
        }
    },
}))