import clsx from "clsx";
import React from "react";

const CButtonFrontDesk: React.FC<Props> = ({ children, className, onClick, disabled }): JSX.Element => {
    return (
        <button
            className={clsx(className, `ml-3 w-full control-color-blue focus-grey front-desk-control py-2 px-4 rounded flex justify-center col-span-2`)}
            onClick={onClick}
            style={{ whiteSpace: "nowrap", opacity: disabled ? "50%" : "" }}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default React.memo(CButtonFrontDesk);
