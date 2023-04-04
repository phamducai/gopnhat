import React from "react";
import { Drawer } from "antd";
import { DrawerProps } from "antd/lib/drawer";
import { createUseStyles } from "react-jss";
import clsx from "clsx";

interface PropsCDrawer extends DrawerProps {
    boxShadow?: boolean;
    content: React.ReactNode;
}

const useRootStyles = createUseStyles({
    rootCDrawer: {
        position: 'absolute',
        '& .ant-drawer-body': {
            padding: 0
        },
        zIndex: 3
    },
    noneBoxShadow: {
        '& > div': {
            boxShadow: 'none !important',
        }
    }

})

export default function CDrawer({ boxShadow = false, content, className, getContainer = false, ...rest }: PropsCDrawer): JSX.Element {
    const classes = useRootStyles();

    return (
        <Drawer
            className={clsx(
                className,
                classes.rootCDrawer,
            )}
            width="100%" closable={false} mask={false} getContainer={getContainer} {...rest}>
            {content}
        </Drawer>
    )
}