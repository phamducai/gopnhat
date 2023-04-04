/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useStyleTheme } from 'theme';
import { Button, Input, Select  } from 'antd';
import CIconSvg from 'components/CIconSvg';

import { styleInput } from 'pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style';
import DatePicker from 'components/CDatePicker';
import { Controller } from 'react-hook-form';
import { useSelectorRoot } from 'redux/store';
import { FloorInv } from 'common/model-inventory';
const { Option } = Select;

interface PropFilter{
    control: any,
    getValues: any,
    dataFloor: FloorInv[],
    setValue: any,
    selectedDate: Date
}

const FormFilter = ({ control, getValues, dataFloor, setValue, selectedDate}: PropFilter) =>{
    const classesInput = useStyleTheme(styleInput);
    const { roomType } = useSelectorRoot(state => state.booking);

    const resetFormSearch = () => {
        setValue("roomName", "");
        setValue("roomType", "");
        setValue("floor", -1);
    }
    const renderRoomType = (data: any, isFloor = false) => {
        return data?.map((item: any) => {
            return (
                <Option value={ !isFloor ? item.guid : item.key} key={!isFloor ? item.guid : item.key}>{!isFloor ? item.ten : item.name}</Option>
            )
        })
    }
    return (
        <div className={`grid grid-cols-12 gap-2`}>
            <div className="col-span-3">
                <p className={`${classesInput.title} m-0 font-base font-bold`}>Room Name</p>
                <Controller
                    render={({ onChange, value }) => 
                        <Input
                            placeholder="Room name"
                            onChange={(e) => onChange(e)}
                            value={getValues("roomName")}
                            className={`${classesInput.input}`}
                            style={{ background: "#F5F6F7", height: 40 }}
                        />}
                    name="roomName" defaultValue={""} control={control}
                />
            </div>
            <div className="col-span-3">
                <p className={`${classesInput.title} m-0 font-base font-bold`}>Room Type</p>
                <Controller
                    render={({ onChange, value }) => 
                        <Select className={`${classesInput.selectBackground} w-full !rounded-md`}
                            showSearch
                            defaultValue={""}
                            onChange={(e) => {
                                onChange(e)
                            }}
                            value={getValues("roomType")}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value={""}>All Room Type</Option>
                            {roomType ? renderRoomType(roomType) : ""}
                        </Select>
                    }
                    name="roomType" defaultValue={""} control={control}
                />
            </div>
            <div className="col-span-2">
                <p className={`${classesInput.title} m-0 font-base font-bold`}>Floor</p>
                <Controller
                    render={({ onChange, value }) => 
                        <Select className={`${classesInput.selectBackground} w-full !rounded-md`}
                            showSearch
                            defaultValue={-1}
                            onChange={(e) => {
                                onChange(e)
                            }}
                            value={getValues("floor")}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value={-1}>All floor</Option>
                            {dataFloor ? renderRoomType(dataFloor, true) : ""}
                        </Select>}
                    name="floor" defaultValue={-1} control={control}
                />
            </div>
            <div className="col-span-2">
                <p className={`${classesInput.title} m-0 font-base font-bold`}>Selected Date</p>
                <Controller
                    render={({ onChange, value }) => 
                        <DatePicker
                            allowClear={false}
                            onChange={(date) => onChange(date)}
                            placeholder="Selected date"
                            value={getValues("selectedDate") ? getValues("selectedDate") : new Date(selectedDate)}
                            className={`${classesInput.datePicker} w-full`}
                            style={{ background: "#F5F6F7", height: 40 }}
                            format="DD/MM/YYYY"
                            name="selectedDate"
                        />}
                    name="selectedDate" defaultValue={new Date()} control={control}
                />
            </div>
            <div className="col-span-2 flex items-end justify-end gap-2">
                <div style={{ width : "5%", borderLeft: "1px solid #e6e6e6", height: "30px", marginBottom : "0.3rem"}}></div>
                <Button htmlType="submit" 
                    type="primary"  style={{ display : "flex"}} 
                    className={`${classesInput.buttonStyle} ${classesInput.backGround} !rounded-md gap-1 items-center a`}
                >
                    <CIconSvg name="search" hexColor="#FFFFFF" svgSize="medium" /> Search
                </Button>
                <Button style={{ color: "#F74352", border: "1px solid #F74352" }} 
                    className={`!rounded-md ${classesInput.buttonStyle} items-center`} 
                    onClick={resetFormSearch}
                >
                    <CIconSvg name="trash" hexColor="#F74352" svgSize="medium" />
                </Button>
            </div>
        </div>
    )
}
export default React.memo(FormFilter);