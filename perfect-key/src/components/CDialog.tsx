import React from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';

type PropsDialog = ModalProps & {
    content: React.ReactNode;
    hasMaskBackground?: boolean
};

const CDialog = ({content, className, hasMaskBackground = true, destroyOnClose = true, ...props}: PropsDialog): JSX.Element => {
    const bgMask = hasMaskBackground ? 'rgba(0, 0, 0, 0.45)' : 'transparent';

    return (
        <Modal 
            width="auto"
            centered={true}
            focusTriggerAfterClose={false}
            destroyOnClose={destroyOnClose}
            maskStyle={{backgroundColor: bgMask}}
            modalRender={(_) => <div className="pointer-events-auto shadow-1">{content}</div>}
            {...props} />
    )
};

export default CDialog;