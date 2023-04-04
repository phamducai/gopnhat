/* eslint-disable */
import CModel from 'components/CModal';
import React from 'react';
import { useStyleTheme } from 'theme';
import { Input,Button,DatePicker, Select } from 'antd';
import { styleCTableFixCharge } from 'pages/main/booking/reservation/editReservation/styles/index.style';
import { styleInput } from 'pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useSelectorRoot } from 'redux/store';
import Utils from 'common/utils';
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;
interface PropsFlightInfo {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
}

const CFlightInfo = ({ visible, setVisible}: PropsFlightInfo) => {
    const classesForm = useStyleTheme(styleInput);
    const classes = useStyleTheme(styleCTableFixCharge);
    const { handleSubmit, control } = useForm();
    const {dateRsvn} = useSelectorRoot(state => state.rsvn);
    const onSubmit =(data: any)=>{
        console.log(data);
    }
    return (
        <CModel 
            title="Flight Information"
            visible={visible}
            onOk={() => console.log("Ok")}
            onCancel={() => setVisible(false)}
            width={"50%"}
            content={
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={`grid grid-cols-10 gap-2`}>
                        <div className={`col-span-3`}>
                            <div className={`${classes.titleColor} m-0 font-base font-bold`}>Arrival Flight No.:</div>
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
                        <div className={`col-span-3`}>
                            <div className={`${classes.titleColor} m-0 font-base font-bold`}>Date:</div>
                            <Controller 
                            //defaultValue={defaultValueForm?.dateArrival ? defaultValueForm?.dateArrival : arrivalDate}
                            name="arrivalDateCharge"
                            render={({ onChange, value }) =>
                                <DatePicker //value={arrivalDate}
                                    defaultValue={moment(Utils.formatDateCallApi(dateRsvn.arrivalDate))}
                                    onChange={(date) => {
                                        //onSetArrivalDateChange(date)
                                        onChange(date)
                                    }}
                                    //defaultValue={arrivalEdit}
                                    name="arrivalDateCharge"
                                    className={`${classesForm.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                />}
                            control={control} defaultValue="" />
                        </div>
                        <div className={`col-span-3`}>
                            <div className={`${classes.titleColor} m-0 font-base font-bold`}>ETA:</div>
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
                            <Button 
                                type="primary" htmlType="submit" 
                                className={`!rounded-md ${classesForm.btnStyle}`}
                            >
                                Pickup
                            </Button>
                        </div>
                        <div className={`col-span-3`}>
                            <div className={`${classes.titleColor} m-0 font-base font-bold`}>Departure Flight No.:</div>
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
                        <div className={`col-span-3`}>
                            <div className={`${classes.titleColor} m-0 font-base font-bold`}>Date:</div>
                            <Controller 
                            //defaultValue={defaultValueForm?.dateArrival ? defaultValueForm?.dateArrival : arrivalDate}
                            name="departurelDateCharge"
                            render={({ onChange, value }) =>
                                <DatePicker //value={arrivalDate}
                                    onChange={(date) => {
                                        //onSetArrivalDateChange(date)
                                        onChange(date)
                                    }}
                                    defaultValue={moment(Utils.formatDateCallApi(dateRsvn.departureDate))}
                                    name="departurelDateCharge"
                                    className={`${classesForm.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                />}
                            control={control} defaultValue=""/>
                        </div>
                        <div className={`col-span-3`}>
                            <div className={`${classes.titleColor} m-0 font-base font-bold`}>ETA:</div>
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
                            <Button 
                                type="primary" htmlType="submit" 
                                className={`!rounded-md ${classesForm.btnStyle}`}
                            >
                                Pickup
                            </Button>
                        </div>
                        <div className={`col-span-12`}>
                            <div className={`${classes.titleColor} m-0 font-base font-bold`}>Comment:</div>
                            <Controller as={<TextArea className={`${classesForm.textArea}`} style={{ height: 80, backgroundColor: "#F5F6F7", borderRadius : 6 }} placeholder="Input comment here" />}
                                name="comment" defaultValue="" control={control} />
                        </div>
                    </div>
                </form>
            }
        />
    );
};

export default React.memo(CFlightInfo);