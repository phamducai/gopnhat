import clsx from 'clsx';
import React from 'react';
import { createStyles, useStyleTheme } from "theme/Theme";

const styleClassBox = createStyles((theme) => ({
    classBox: {
        background: "#FFFFFF",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        padding: "15px",
        paddingTop: "0px",
        height: "100%"
    },
    classBoxTitle: {
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "16px",
        textTransform: "uppercase",
        color: "#00293B",
        display: "flex",
        alignItems: "center",
        paddingTop: 10,

    },
}));

export interface IClassBox extends Props {
    title?: string,
}

const ClassBox = ({ title, children, onClick, ...props }: IClassBox): JSX.Element => {
    const classes = useStyleTheme(styleClassBox);
    return (
        <div onClick={onClick} className={clsx(classes.classBox, props.className)}>
            {title && <div className={classes.classBoxTitle}>{title}</div>}
            {children}
        </div>
    )
};

export default ClassBox;