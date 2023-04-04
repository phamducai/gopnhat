/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tooltip } from 'antd';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { createStyles, ThemeDefine, useStyleTheme } from 'theme';
import CIconSvg from './CIconSvg';
import CScrollView from './CScrollView';
// interface ICSidebar extends Props {
//     contentSidebar?: React.ReactNode,
//     setWidth?: number,
//     setVisible: React.Dispatch<React.SetStateAction<boolean>>,
//     visible?: boolean,
//     isIpadScreen?: boolean
// }

const styleCSidebar = createStyles((theme: ThemeDefine) => ({
    mainSidebar: {
        height: `calc(${theme.height.fullScreen} - ${theme.height.navbar})`
    },
    bgIconBack: {
        height: "20px",
        width: "20px",
        background: "#e5eaeb",
        borderRadius: "4px"
    },
}));

const Index = ({ contentSidebar, children, setWidth = 347,setVisible, visible, isIpadScreen, ...props }: any): JSX.Element => {
    const classes = useStyleTheme(styleCSidebar);
    const [nWidth, setnWidth] = useState(setWidth)
    const [ipadWidth, setIpadWidth] = useState("347")
    const ref = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (ref.current && ref.current.clientWidth) {
            setnWidth(ref.current.clientWidth)
        }
    }, [])

    React.useEffect(() => {
        if (visible) {
            setnWidth(0)
            setIpadWidth("0px")
        } else {
            setIpadWidth("100vw")
            setnWidth(setWidth)
        }
        //eslint-disable-next-line
    }, [visible])

    return (
        <div className={`${clsx(props.className, classes.mainSidebar)} flex`}>
            <div style={ isIpadScreen ? {width: `${ipadWidth}`} :{width: `${nWidth}px`}} ref={ref} className={`bg-white shadow-lg relative transition-all`}>
                <Tooltip title={nWidth === 0 ? 'Show' : 'Hide'}>
                    <div
                        onClick={() => setVisible(!visible)}
                        style={{ top: nWidth === 0 ? "35px" : "30px", left: nWidth === 0 ? "5px" : "30px" }}
                        className={`${classes.bgIconBack} transform ${nWidth === 0 && 'rotate-180'} flex items-center justify-center absolute cursor-pointer`}>
                        <CIconSvg className="absolute" name="back" svgSize="small" />
                    </div>
                </Tooltip>
                {nWidth !== 0 && contentSidebar}
            </div>
            <CScrollView overlayClassScroll="custom-scrollbar-pkm">
                <div className="p-7 pb-4 " style={{ width: `calc(100vw - ${nWidth}px)` }}>
                    {children}
                </div>
            </CScrollView>
        </div>
    )
}

const CSidebar = React.memo(Index);
export default CSidebar