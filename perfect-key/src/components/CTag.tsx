import CIconSvg from 'components/CIconSvg';
import React from 'react';
import { createStyles, useStyleTheme } from 'theme'
export const styleReservation = createStyles((theme) => ({
    heightTag: {
        height: "30px",
        lineHeight: "30px !important",
        border: "1px",
        borderRadius: "4px",
        opacity: 1,
        '& .border-tag-custom': {
            borderRadius: "0px 4px 4px 0px",
            '& span': {
                fontSize: "14px",
                opacity: "1 !important",
                fontWeight: "600 !important",
            }
        },
    }
}))
interface PropsTag {
    title : string,
    color : string,
    icon? : string,
    isShowIcon: boolean
}
const CTag = ({ title, color, icon, isShowIcon}: PropsTag):  JSX.Element => {
    const classes = useStyleTheme(styleReservation);
    return (
        <div className={`${classes.heightTag} border-tag-custom flex items-center h-full w-full relative`} 
            style={{ backgroundColor : `rgb(${color},0.1)`, borderLeft : `3px solid rgb(${color})`}}
        >
            <span className={`font-base font-bold ml-2`} style={{ color : `rgb(${color})`}}>{title}</span>
            {isShowIcon ? 
                <CIconSvg 
                    className="fixed-icon absolute right-0 w-1/6" 
                    name={icon} hexColor="#56CCF2" svgSize="small" 
                />
                : ""
            }
        </div>
    );
};

export default CTag;