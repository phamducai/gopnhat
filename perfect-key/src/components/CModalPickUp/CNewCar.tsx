/* eslint-disable */
import React from 'react';
import {useStyleTheme } from 'theme';
import { Input,Button, Select } from 'antd';
import { styleCTableFixCharge } from 'pages/main/booking/reservation/editReservation/styles/index.style';
import { styleInput } from 'pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
const { Option } = Select
const { TextArea } = Input;
const CNewCar = () => {
    const classes = useStyleTheme(styleCTableFixCharge);
    const classesForm = useStyleTheme(styleInput);
    const { handleSubmit, control } = useForm();
    return (
        <div className={`grid grid-cols-2 gap-3`}>
            <div className={`col-span-1`}>
                <div className={`${classes.titleColor} m-0 font-base font-bold`}>Code:</div>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classesForm.selectBackground} w-full !rounded-md`} placeholder="Select here"
                            showSearch
                            onChange={(e) => {
                                onChange(e)
                            }}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                        </Select>
                    }
                    name="resMarket" defaultValue="" control={control} />
            </div>
            <div className={`col-span-1`}>
                <div className={`${classes.titleColor} m-0 font-base font-bold`}>License Plate:</div>
                <Controller
                    as={
                        <Input  
                            className={`${classesForm.input} w-full`} 
                            type="text" placeholder="Enter code" 
                            style={{height: 40 }}
                        />} 
                    name="resMarket" defaultValue="" control={control} />
            </div>
            <div className={`col-span-2`}>
                <div className={`${classes.titleColor} m-0 font-base font-bold`}>Drive’s Name:</div>
                <Controller
                    defaultValue='' name='extraBed' control={control}
                    as={
                        <Input 
                            //defaultValue={selectedProfile.length > 0 ? (selectedProfile[0]?.firstName ?? "") : ""} 
                            className={`${classesForm.input} w-full`} 
                            type="text" placeholder="Enter code" 
                            style={{height: 40 }}
                        />} 
                />
            </div>
            <div className={`col-span-1`}>
                <div className={`${classes.titleColor} m-0 font-base font-bold`}>Phone Number:</div>
                <Controller
                    defaultValue='' name='extraBed' control={control}
                    as={
                        <Input 
                            //defaultValue={selectedProfile.length > 0 ? (selectedProfile[0]?.firstName ?? "") : ""} 
                            className={`${classesForm.input} w-full`} 
                            type="text" placeholder="Enter code" 
                            style={{height: 40 }}
                        />} 
                />
            </div>
            <div className={`col-span-1`}>
                <div className={`${classes.titleColor} m-0 font-base font-bold`}>Phone 2:</div>
                <Controller
                    defaultValue='' name='extraBed' control={control}
                    as={
                        <Input 
                            //defaultValue={selectedProfile.length > 0 ? (selectedProfile[0]?.firstName ?? "") : ""} 
                            className={`${classesForm.input} w-full`} 
                            type="text" placeholder="Enter code" 
                            style={{height: 40 }}
                        />} 
                />
            </div>
            <div className={`col-span-2`}>
                    <div className={`${classes.titleColor} m-0 font-base font-bold`}>Comment:</div>
                    <Controller as={<TextArea className={`${classesForm.textArea}`} style={{ height: 80, backgroundColor: "#F5F6F7", borderRadius : 6 }} placeholder="Input comment here" />}
                        name="comment" defaultValue="" control={control} />
                </div>
        </div>
    );
};

export default CNewCar;