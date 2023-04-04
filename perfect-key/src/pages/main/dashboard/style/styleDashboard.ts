import { createStyles, ThemeDefine } from 'theme'

export const styleDashboard = createStyles((theme: ThemeDefine) => ({
    dashboard: {
        fontSize: "14px",
        height: `calc(${theme.height.fullScreen} - ${theme.height.navbar})`
    },
    dashboardTitle: {
        fontStyle: "normal",
        fontSize: "20px",
        lineHeight: "27px",
        color: "#00293b",
    }
}))