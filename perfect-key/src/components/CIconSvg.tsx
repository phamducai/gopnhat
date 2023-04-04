/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import clsx from 'clsx';
import { Tooltip } from 'antd';
import { createStyles, ThemeDefine, useStyleTheme } from 'theme';
import { useIconSvg } from 'hooks/useIconSvg';
import { PropsIcon, Size } from 'common/define-type';

type PropsUseTheme = Pick<PropsIcon, 'colorSvg'| 'svgSize' | 'disabled'>;
const SvgSizeNumber: Record<Size, string> = {
    default: "24px",
    mini: "6px",
    small: "14px",
    medium: "18px",
    big: "30px",
    large: "35px",
};
const getColor = (theme: ThemeDefine, props: PropsUseTheme) => {
    if (props.disabled) {
        return theme.palette.disabled;
    }
    if (props.colorSvg) {
        const color = theme.palette[props.colorSvg];
        if (color) {
            return color;
        } else if (typeof props.colorSvg === 'string' && props.colorSvg.charAt(0) === '#') {
            return props.colorSvg;
        }
    }
};

const styles = createStyles((theme: ThemeDefine) => ({
    colorIcon: {
        '& > svg': {
            '& rect,circle,line,polygon,polyline,path': {
                stroke: (props: PropsUseTheme) => getColor(theme, props)
            },
            // '& path': {
            //     fill: (props: PropsUseTheme) => getColor(theme, props)
            // }
        }
    },
    sizeIcon: {
        '& > svg':  {
            lineHeight: (props: PropsUseTheme) => `${SvgSizeNumber[props.svgSize!]}`,
            height: (props: PropsUseTheme) => `${SvgSizeNumber[props.svgSize!]}`,
            width: (props: PropsUseTheme) => `${SvgSizeNumber[props.svgSize!]}`,
        }
    }
}));

const CIconSvgComponent = ({name, tooltip, ...props}: PropsIcon): JSX.Element | null => {
    const iconSvg = useIconSvg(name ?? '');
    const {svgSize = 'default', disabled, rotateDeg} = props;
    const colorFinal = props.colorSvg ?? props.hexColor ?? 'default';
    const classes = useStyleTheme(styles, {colorSvg: colorFinal, svgSize, disabled});

    const createHTML = (str = '') => {
        return {__html: str};
    };
    const stylesEx = rotateDeg ? {transform: `rotate(${rotateDeg}deg)`, ...props.style}: props.style;
    
    const divResult = (
        <div 
            className={clsx(
                'flex justify-center items-center', 
                {
                    [classes.colorIcon]: props.colorSvg !== 'origin',
                    'pointer-events-none': disabled
                },
                props.className,
                classes.sizeIcon
            )}
            onClick={props.onClick}
            style={stylesEx}
            dangerouslySetInnerHTML={createHTML(iconSvg)}>
        </div>
    );
    if (iconSvg) {
        if (tooltip?.title) {
            const placement = tooltip.placement ?? 'top';
            return (
                <Tooltip title={tooltip.title} placement={placement}>
                    {divResult}
                </Tooltip>
            )
        }
        return divResult;
    }
    return null;
};

const CIconSvg = React.memo(CIconSvgComponent);
export default CIconSvg;