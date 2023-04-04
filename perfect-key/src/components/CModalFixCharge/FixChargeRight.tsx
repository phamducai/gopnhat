/* eslint-disable */
import React from 'react';
import { Table,Radio, Input,Button, RadioChangeEvent } from 'antd';
import { useStyleTheme } from 'theme';
import clsx from 'clsx';
import { styleCTableFixCharge } from 'pages/main/booking/reservation/editReservation/styles/index.style';
import { styleInput } from 'pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style';
import { Controller } from 'react-hook-form';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { setDateRsvn,setDataFoextraChargeDetail } from 'redux/controller/reservation.slice';
import { useState } from 'react';
import { ITableNight } from 'common/model-booking';
import FixChargesService from 'services/booking/fixcharges.service';
import { styleReinstateTable } from 'components/CStyleTable';
const columnTable = [
    {
        title: 'No',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: 'Night From',
        dataIndex: 'nightFrom',
        key: 'nightFrom',
        width: "30%"
    },
    {
        title: 'Night To',
        dataIndex: 'nightTo',
        key: 'nightTo',
    },
    {
        title: 'Notes',
        dataIndex: 'notes',
        key: 'notes',
    },
];

const CFixChargeRight = ({...props}: any) => {
    const { control,getValues } = props;
    const classes = useStyleTheme(styleCTableFixCharge);
    const classesTable = useStyleTheme(styleReinstateTable);
    const classesForm = useStyleTheme(styleInput);
    const [dataTableNight,setDataTableNight] = useState<ITableNight[]>([]);
    const dispatch = useDispatchRoot();
    const { accountNameFixCharge, dateRsvn,dataExtraChargeDetail } = useSelectorRoot(state => state.rsvn);
    const handleOnChange = (e: RadioChangeEvent) => {
        let numberNight: number = FixChargesService.handleDateFixCharge(e.target.value,dateRsvn.defineNight);
        dispatch(setDataFoextraChargeDetail({
            ...dataExtraChargeDetail,
            kieuNgay: e.target.value,
            tuNgay: 0,
            denNgay: 0,
            soNgay: numberNight
        }))
    }
    const handleAddRowTable = () => {
        const valueRadio = getValues("typeDate");
        if(parseInt(valueRadio) === 4 && getValues("formNight") !== "" && getValues("toNight") !== ""){
            const keyNext = dataTableNight.length > 0 ? dataTableNight[dataTableNight.length - 1].key + 1 : 1;
            if(parseInt(getValues("toNight")) <= dateRsvn.defineNight){
                const data: ITableNight = {
                    key: keyNext,
                    nightFrom: "15/08/2021",
                    nightTo: "18/08/2021",
                    notes: ""
                }
                setDataTableNight([...dataTableNight,data])
            }else{
                alert("ngay nhap khong hop le")
            }
        } else{
            alert("nhap day du thong tin")
        }
    }
    return (
        <div className={`${classes.classBoxFixCharge} col-span-2 grid grid-flow-row auto-rows-max`}>
            <Table className={clsx(classesTable.table,"col-span-12")} style={{ height : "45vh" }} 
                locale={{ emptyText: 
                <div 
                    className="flex items-center justify-center"
                    style={{height: "45vh"}}>No data</div> }}
                pagination={false} 
                dataSource={dataTableNight}
                columns={columnTable} 
                rowClassName={`${classesTable.editRowTable}`}
            />
            <div className="xl:col-span-12 col-span-1 grid-cols-12 mb-2 grid gap-2 text-xs font-bold leading-7 relative" 
                style={{ paddingLeft : 15, paddingRight : 15}}
            >
                <div className={`${classes.title} mt-2 col-span-12`}>{accountNameFixCharge}</div>
                <div className="col-span-12">
                    <Controller
                        control={control}
                        defaultValue={0}
                        name="typeDate"
                        render={({ onChange }) => (
                            <Radio.Group
                                className={`${classes.radioGroup} font-semibold text-base`}
                                onChange={e => { 
                                    onChange(e.target.value); 
                                    handleOnChange(e)
                                }}
                                value={getValues("typeDate")}
                            >
                                <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-1/3`} value={1}>First Night</Radio>
                                <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-1/2`} value={0}>All Nights</Radio>
                                <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-1/3`} value={2}>Last Night</Radio>
                                <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-1/2`} value={3}>First Night & Last Night</Radio>
                                <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-1/3`} value={4}>Night From</Radio>
                            </Radio.Group>
                        )}
                    />
                </div>
                <div className="absolute gap-2 flex flex-row justify-center items-center" 
                    style={{ width: "11.1rem", bottom: "0.6rem", left: "7.5rem" }}>
                    <Controller
                        defaultValue='' name='formNight' control={control}
                        as={
                            <Input 
                                //defaultValue={selectedProfile.length > 0 ? (selectedProfile[0]?.firstName ?? "") : ""} 
                                className={`${classesForm.input} w-full`} 
                                style={{height: 40 }}
                                min={0}
                                type="number" 
                            />} 
                    />
                    <div className={`${classes.titleColor} col-span-12`}>to</div>
                    <Controller
                        defaultValue='' name='toNight' control={control}
                        as={
                            <Input 
                                //defaultValue={selectedProfile.length > 0 ? (selectedProfile[0]?.firstName ?? "") : ""} 
                                className={`${classesForm.input} w-full`} 
                                style={{height: 40 }}
                                min={0}
                                type="number" 
                            />} 
                    />
                    <Button 
                        type="primary" 
                        className={`!rounded-md ${classesForm.buttonStyle}`} 
                        style={{height: "40px !important" }}
                        onClick={handleAddRowTable}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
            
    );
};

export default React.memo(CFixChargeRight);