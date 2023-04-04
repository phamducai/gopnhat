/* eslint-disable */
import React from 'react';
import {useStyleTheme } from 'theme';
import { Input,Button, Select } from 'antd';
import { styleCTableFixCharge } from 'pages/main/booking/reservation/editReservation/styles/index.style';
import { styleInput } from 'pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import {styleButton} from './index';
const { Option } = Select;
const { TextArea } = Input;

interface PropsPickUp{
    setShowNewCar : React.Dispatch<React.SetStateAction<boolean>>
}
const COMPickUp = ({setShowNewCar}: PropsPickUp) => {
    const classesForm = useStyleTheme(styleInput);
    const classes = useStyleTheme(styleCTableFixCharge);
    const classesBtn = useStyleTheme(styleButton);
    const { handleSubmit, control } = useForm();
    const onSubmit =(data: any)=>{
        console.log(data);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} id="formPickUp">
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
                    <div className={`${classes.titleColor} m-0 font-base font-bold`}>Pickup Time:</div>
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
                <div className={`col-span-2`}>
                    <div className={`${classes.titleColor} m-0 font-base font-bold`}>Pickup Arrival:</div>
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
                <div className={`col-span-1 grid grid-cols-1 gap-2`}>
                    <div className={`col-span-1`}>
                        <div className={`${classes.titleColor} m-0 font-base font-bold`}>Vehicles Arrival:</div>
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
                        <div className={`${classes.titleColor} m-0 font-base font-bold`}>Pickup Departure:</div>
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
                        <div className={`${classes.titleColor} m-0 font-base font-bold`}>Vehicles Departure:</div>
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
                </div>
                <div className={`col-span-1 mt-7`}>
                    <Button 
                        type="ghost"
                        className={`${classesBtn.buttonPickStyle} !rounded-md w-10/12`}
                        onClick={() => setShowNewCar(true)}
                    >New Car</Button>
                    <Button 
                        type="ghost"
                        className={`${classesBtn.buttonPickStyle} !rounded-md w-10/12 mt-5`}
                    >Edit Car</Button>
                </div>
                <div className={`col-span-2`}>
                    <div className={`${classes.titleColor} m-0 font-base font-bold`}>Comment:</div>
                    <Controller as={<TextArea className={`${classesForm.textArea}`} style={{ height: 80, backgroundColor: "#F5F6F7", borderRadius : 6 }} placeholder="Input comment here" />}
                        name="comment" defaultValue="" control={control} />
                </div>
            </div>
        </form>
    );
};

export default React.memo(COMPickUp);