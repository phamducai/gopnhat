import React from 'react';
import { Popover, PopoverProps } from "antd";
import { createStyles, useStyleTheme } from 'theme';

interface CPopoverProps extends PopoverProps {
    isShowArrow?: boolean;
    content: React.ReactNode
}

const styles = createStyles((theme) => ({
    'override-popover': {
        '& .ant-popover-arrow': {
            display: (props: {isShowArrow: boolean}) => props.isShowArrow ? 'block': 'none'
        },
        '& .ant-popover-inner-content': {
            padding: 4
        },
        height: 240,
        overflow: 'auto',
        paddingTop: (props: {isShowArrow: boolean}) => props.isShowArrow ? 10 : 0
    }
}))
export default function CPopover({isShowArrow = false, content, ...other}: CPopoverProps): JSX.Element {
    const classes = useStyleTheme(styles, {isShowArrow});

    return (
        <Popover 
            title="" 
            content={content} 
            trigger="click"
            overlayClassName={`${classes['override-popover']} custom-scrollbar-pkm` }>
            {other.children}
        </Popover>
    )
}