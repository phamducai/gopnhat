import React from "react";
import clsx from "clsx";

interface ScrollViewProp extends Props {
    overlayClassScroll?: string
}
const CScrollViewComponent = ({children, className, overlayClassScroll}: ScrollViewProp): JSX.Element | null => {
    if (!children) {
        return null;
    }

    return (
        <div className={clsx(
            className,
            !overlayClassScroll && 'custom-scrollbar-default',
            overlayClassScroll,
        )}>
            {children}
        </div>
    )
}

const CScrollView = React.memo(CScrollViewComponent);
export default CScrollView;