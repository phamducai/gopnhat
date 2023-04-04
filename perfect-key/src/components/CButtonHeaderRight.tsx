import React from 'react'
import { createStyles, useStyleTheme } from 'theme';
const styleButton = createStyles((theme) => ({
    buttonHeaderRightActive: {
        background: "white",
        boxShadow: "0px 2px 6px rgba(8, 35, 48, 0.2), 0px 1px 2px rgba(8, 35, 48, 0.24)",
        paddingTop: 18,
        paddingBottom: 18,
        width: 206,
        "@media (max-width:1024px)": {
            width: 142
        }
    },
    buttonHeaderRight: {
        background: "#EBEBEB",
        opacity: 0.6,
        boxShadow: "0px 2px 6px rgba(8, 35, 48, 0.2), 0px 1px 2px rgba(8, 35, 48, 0.24)",
        paddingTop: 18,
        paddingBottom: 18,
        width: 206,
        "@media (max-width:1024px)": {
            width: 142
        }
    }
}))
interface Props {
    active: boolean,
    title: string,
}
export default function ButtonHeaderRight(props: Props): JSX.Element {
    const { active, title } = props;
    const classes = useStyleTheme(styleButton);
    return (
        <div className={`whitespace-nowrap px-10 bg-white rounded mx-2 text-base font-semibold cursor-pointer ${active ? classes.buttonHeaderRightActive : classes.buttonHeaderRight} flex justify-center`}>
            {title}
        </div>
    )
}
