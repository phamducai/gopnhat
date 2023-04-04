import clsx from 'clsx';
import CLanguage from 'components/CLanguage';
import React from 'react';
import User from './User';

function CRightNavbar(props: Props): JSX.Element {
    return (
        <div className={clsx(
            'flex justify-end items-center mr-4 space-x-3',
            props.className
        )}>
            <CLanguage />
            <User />
        </div>
    )
}

const RightNavbar = React.memo(CRightNavbar);
export default RightNavbar