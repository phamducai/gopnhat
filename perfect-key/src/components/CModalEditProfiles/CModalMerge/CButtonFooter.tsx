/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useStyleTheme } from 'theme';
import { editProfilesStyle } from '../styles/editProfiles'
import { PrinterOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface CButtonFooterProps {
    setVisible: any
}

const CButtonFooter = (props: CButtonFooterProps): JSX.Element => {
    const { setVisible } = props
    const classes = useStyleTheme(editProfilesStyle);

    return (
        <div className="flex justify-between m-auto">
            <div>
                <button className={`${classes.buttonFooterLeft} hover:bg-gray-100`}>
                    <div className="flex items-center font-semibold">
                        <PrinterOutlined className='pr-2' /> Print
                    </div>
                </button>
                <button className={`${classes.buttonFooterLeft} hover:bg-gray-100`}>
                    <div className={`flex items-center font-semibold`}>
                        <PrinterOutlined className='pr-2' /> Print by Arr. Date
                    </div>
                </button>
                <button className={`${classes.buttonFooterLeft} hover:bg-gray-100`}>
                    <div className={`flex items-center font-semibold`}>
                        <PrinterOutlined className='pr-2' /> Print Details
                    </div>
                </button>
            </div>
            <div>
                <Button
                    className={`${classes.buttonFooterRight} !rounded-md`}
                    style={{ color: "#F74352", border: "1px solid #F74352" }}
                    onClick={() => setVisible(false)}
                >Cancel</Button>
            </div>
        </div>
    );
}

export default CButtonFooter;