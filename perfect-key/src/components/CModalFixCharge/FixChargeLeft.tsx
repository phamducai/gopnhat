/* eslint-disable */
import React, {useState} from 'react';
import { Input,DatePicker,Button } from 'antd';
import { useStyleTheme } from 'theme';
import { styleInput } from 'pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style';
import { Controller } from 'react-hook-form';
import { styleCTableFixCharge } from 'pages/main/booking/reservation/editReservation/styles/index.style';
import { ITableFixCharge } from 'common/model-booking';
import TableFixCharge from './TableFixCharge';
import { DataFoextraCharge } from "common/model-rsvn";
import { useSelectorRoot } from 'redux/store';
import moment from 'moment';
import Utils from 'common/utils';
import FixChargesService from 'services/booking/fixcharges.service';
interface Props{
    control?: any;
    dataTable: ITableFixCharge[],
    isRefreshTable: boolean;
    setRefreshTable: React.Dispatch<React.SetStateAction<boolean>>,
    getValues: any,
    setValue: any,
    isEdit: boolean
}
const CFixChareLeft = ({control,dataTable,setRefreshTable,isRefreshTable, getValues, setValue, isEdit} : Props) => {
    const classes = useStyleTheme(styleCTableFixCharge);
    const classesForm = useStyleTheme(styleInput);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { dateRsvn } = useSelectorRoot(state => state.rsvn);
    const [totalExtraBed, setTotalExtraBed] = useState<number>(0);
    const [extraBedUser, setExtraBedUse] = useState<number>(0);
    const [extraBedAvailable, setExtraBedAvailable] = useState<number>(0);
    const [maxExtraBed, setMaxExtraBed] = useState<number>(0);
    const handleRefresh = () => {
        setRefreshTable(!isRefreshTable);
    }

    React.useEffect(() => {
        const fetchInfoExtraBed = async () => {
            const res = await FixChargesService.getInfoExtraBed(dateRsvn.arrivalDate, dateRsvn.departureDate, hotelId);
            if(res){
                setTotalExtraBed(res.totalExtraBed);
                setExtraBedUse(res.extraBedUser);
                setExtraBedAvailable(res.totalExtraBed - res.extraBedUser);
                if(isEdit){
                    const getAmount = dataTable.find(x => x.ma === "304");
                    const amount = getAmount ? getAmount.soLuong : 0;
                    setMaxExtraBed(amount + (res.totalExtraBed - res.extraBedUser));
                }
                else{
                    setMaxExtraBed(res.totalExtraBed - res.extraBedUser);
                }
            }    
        }
        fetchInfoExtraBed();
    },[dataTable])
    return (
        <div className={`${classes.classBoxFixCharge} col-span-2 grid-cols-12 grid`}>
            <TableFixCharge 
                dataTableFixCharge={dataTable} 
                night={dateRsvn.newNumberNight} 
                getValues={getValues}
                setValue={setValue}
                extraBedAvailable={extraBedAvailable}
                maxExtraBed={maxExtraBed}
            />
            <div className="col-span-12 grid-cols-12 mb-2 grid gap-2 text-xs font-bold leading-7" style={{ paddingLeft : 15, paddingRight : 15}}>
                <div className={`${classes.title} mt-2 col-span-12`}>Extra Bed</div>
                <div className={`col-span-4`}>
                    <div className={`${classes.titleColor}`}>Total Extra Bed:</div>
                    <Input 
                        defaultValue={0}
                        className={`${classesForm.input} w-full`} 
                        type="number" placeholder="Enter code" 
                        value={totalExtraBed}
                        style={{ height: 40 }}
                    />
                </div>
                <div className={`col-span-4`}>
                    <div className={`${classes.titleColor}`}>Extra Bed Used:</div>
                    <Input 
                        defaultValue={0}
                        value={extraBedUser}
                        className={`${classesForm.input} w-full`} 
                        type="number" placeholder="Enter code" 
                        style={{height: 40 }}
                    />
                </div>
                <div className={`col-span-4`}>
                    <div className={`${classes.titleColor}`}>Extra Bed Available:</div>
                    <Input 
                        defaultValue={0}
                        value={extraBedAvailable}
                        className={`${classesForm.input} w-full`} 
                        type="number" placeholder="Enter code" 
                        style={{height: 40 }}
                    />
                </div>
                <div className={`col-span-6`}>
                    <div className={`${classes.titleColor}`}>Arrival:</div>
                    <Controller 
                        defaultValue={dateRsvn.arrivalDate}
                        name="arrivalDate"
                        
                        render={({ onChange, value }) =>
                            <DatePicker 
                                defaultValue={moment(Utils.formatDateCallApi(dateRsvn.arrivalDate))}
                                onChange={(date) => {
                                    onChange(date)
                                    console.log(date,dateRsvn.arrivalDate)
                                }}
                                //defaultValue={arrivalEdit}
                                name="arrivalDate"
                                className={`${classesForm.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                            />}
                        control={control}/>
                </div>
                <div className={`col-span-6`}>
                    <div className={`${classes.titleColor}`}>Departure:</div>
                    <Controller 
                        defaultValue={dateRsvn.departureDate}
                        name="departurelDateCharge"
                        render={({ onChange, value }) =>
                            <DatePicker //value={arrivalDate}
                                defaultValue={moment(Utils.formatDateCallApi(dateRsvn.departureDate))}
                                onChange={(date) => {
                                    //onSetArrivalDateChange(date)
                                    onChange(date)
                                }}
                                //defaultValue={arrivalEdit}
                                name="departurelDateCharge"
                                className={`${classesForm.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                            />}
                        control={control} />
                </div>
                <div className={`col-span-12 flex justify-end`}>
                    <Button type="primary" className={`!rounded-md ${classesForm.buttonStyle}`} onClick={handleRefresh}>Refresh</Button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(CFixChareLeft);