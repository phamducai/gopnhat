/* eslint-disable */
import CModel from 'components/CModal';
import React from 'react';
import {createStyles, ThemeDefine, useStyleTheme } from 'theme';
import { Input, Select } from 'antd';
import { styleCTableFixCharge } from 'pages/main/booking/reservation/editReservation/styles/index.style';
import { styleInput } from 'pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style';
import { useForm } from 'react-hook-form';
import CIconSvg from 'components/CIconSvg';
import { useState } from 'react';
import COMPickup from './CPickUp';
import CNewCar from './CNewCar';
const { Option } = Select;
const { TextArea } = Input;

export const styleButton= createStyles((theme:ThemeDefine) => ({
    buttonPickStyle: {
        height: "60px !important",
        padding: "4px 15px !important",
        border: "none",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 16,
        },
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
    },
    backSquare: {
        background: "#e2e7ea",
        borderRadius: 4,
    }
}));

interface PropsPickUp {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
}

const CPickUp = ({ visible, setVisible}: PropsPickUp) => {
    const classesBtn = useStyleTheme(styleButton);
    const [showNewCar,setShowNewCar] = useState<boolean>(false);
    const onSubmit =(data: any)=>{
        console.log(data);
    }
    return (
        <CModel 
            title={
                !showNewCar ? "Pickup" : 
                <div className={`flex items-center justify-start`}>
                    <div className={`${classesBtn.backSquare} cursor-pointer flex  items-center justify-center p-2 rounded`}
                        onClick={() => setShowNewCar(false)}
                    >
                        <CIconSvg name="back" colorSvg="origin" svgSize="small" />
                    </div>
                    <p className="m-0 text-base	font-bold ml-3">New Car Pickup</p>
                </div>
            }
            visible={visible}
            onOk={() => console.log("Ok")}
            onCancel={() => setVisible(false)}
            myForm={!showNewCar ? "formPickUp" : ""}
            style={{top : "10%" }}
            content={
                !showNewCar ? <COMPickup setShowNewCar={setShowNewCar}/> : <CNewCar />
            }
        />
    );
};

export default React.memo(CPickUp);