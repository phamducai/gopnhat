/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { Checkbox, Input, Select} from "antd";
import { useStyleTheme } from 'theme';
import CModel from 'components/CModal';
import {useDispatchRoot, useSelectorRoot } from 'redux/store';
import { Controller, useForm } from 'react-hook-form';
import { styleInput } from 'pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style'
import DatePicker from 'components/CDatePicker';
import { companyProfilesFilterByInputRequest } from "redux/controller/reservation.slice";
import SmallFuncEditGroup from 'services/search/funeditgroup.service';
import { updateQueryParamStatus } from 'redux/controller/booking.slice';
import { ISearchResult } from 'common/model-booking';
import { parseISO } from 'date-fns';
const { Option } = Select;
interface Props{
    isShowFuncEdit: boolean, 
    setShowFuncEdit: React.Dispatch<React.SetStateAction<boolean>>, 
    selectedRows: ISearchResult[]
}
const FuncEditGroup = ({ isShowFuncEdit, setShowFuncEdit, selectedRows}: Props) => {
    const classes = useStyleTheme(styleInput);
    const { TextArea } = Input;
    const { handleSubmit, control, getValues, setValue } = useForm();
    const { hotelId } = useSelectorRoot(state => state.app);
    const { typeSubMenu, filteredCompanyProfile } = useSelectorRoot(state => state.rsvn);
    const { numberOfRooms } = useSelectorRoot(state => state.app);
    const { queryParam } = useSelectorRoot(state => state.booking);
    const dispatch = useDispatchRoot();
    const typingTimeoutRef = useRef(0);
    console.log("selectedRows",selectedRows);
    useEffect(() => {
        if(selectedRows.length > 0){
            const getQueryParam = queryParam.find( x => x.guid === selectedRows[0].guid);
            if(getQueryParam){
                setValue("rate", getQueryParam.rate);
                setValue("groupCode", selectedRows[0].groupCode.name);
                setValue("arrivalDate", parseISO(getQueryParam.arrivalDate));
                setValue("comments", getQueryParam.comments);
                setValue("departureDate", parseISO(getQueryParam.departureDate));
                setValue("roomType", getQueryParam.roomType);
                setValue("confirmed", getQueryParam.confirmed);
                setValue("cutOfDate", parseISO(getQueryParam.cutOfDate));
                setValue("companyAgentGuid", getQueryParam.companyAgentGuid);
            }
            
        }
    },[selectedRows, setValue, queryParam])
    const onSearch = (val: any) => {
        const value = val.length > 0 ? val : "g";
        if (typingTimeoutRef.current) {
            window.clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
            dispatch(companyProfilesFilterByInputRequest({
                hotelGuid: hotelId,
                input: value
            }))
        }, 300)
    }
    const renderSelect = (data: any[]) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.id}>{item.ten}</Option>
            )
        })
    }
    const onSubmit = handleSubmit( async (data: any) => {
        if(selectedRows.length > 0){
            if(typeSubMenu === "rate"){
                data.rate = parseInt(data.rate);
            }
            const isChild = selectedRows.length > 1 ? false : true;
            const rsvnId = queryParam.find( x => x.guid === selectedRows[0].guid)?.parentGuid;
            const dataMap = SmallFuncEditGroup.mapDataFuncEdit(data, isChild, selectedRows, typeSubMenu);
            await SmallFuncEditGroup.updateFuncEditGroup(rsvnId ?? "", isChild, dataMap);
        }
        setShowFuncEdit(false);
        dispatch(updateQueryParamStatus(true));
    })
    const disableDate = (currentDate: any): boolean => {
        const newDate = new Date(getValues("arrivalDate"));
        if(currentDate <= newDate){
            return true;
        }
        return false;
    }
    const renderRoomType = (data: any,) => {
        return data?.map((item: any, index: number) => {
            return (
                <Option value={item.idy} key={item.id}>{item.name}</Option>
            )
        })
    }
    return (
        <CModel
            title={"Edit Group"}
            visible={isShowFuncEdit}
            onOk={() => onSubmit}
            onCancel={() => setShowFuncEdit(false)}
            myForm="edit-func-edit"
            content={
                <form onSubmit={onSubmit} id="edit-func-edit" className="grid grid-cols-2 gap-2">
                    { typeSubMenu === "rate" ?
                        <div className="col-span-2">
                            <label className={`${classes.title} m-0 font-base font-bold`}>Rate: </label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <Input
                                        type="number"
                                        className={`${classes.input}`}
                                        onChange={e => {
                                            onChange(e)
                                        }}
                                        value={getValues("rate") || undefined}
                                        style={{ background: "#F5F6F7", height: 40 }}
                                    />
                                }
                                control={control} defaultValue="" name={"rate"}
                            />
                        </div>
                        : ""}
                    { typeSubMenu === "groupCode" ? 
                        <div className="col-span-2">
                            <label className={`${classes.title} m-0 font-base font-bold`}>Group Code: </label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <Input
                                        className={`${classes.input}`}
                                        onChange={e => {
                                            onChange(e)
                                        }}
                                        value={getValues("groupCode") || undefined}
                                        style={{ background: "#F5F6F7", height: 40 }}
                                    />
                                }
                                control={control} defaultValue="" name={"groupCode"}
                            />
                        </div>
                        : ""}
                    { typeSubMenu === "arrivalDate" || typeSubMenu === 'edit-arr-de-date'? 
                        <div className={`col-span-${typeSubMenu === 'edit-arr-de-date' ? 1 : 2}`}>
                            <label className={`${classes.title} m-0 font-base font-bold`}>Arrival&apos;s Date: </label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <DatePicker
                                        clearIcon={false}
                                        // disabledDate={(valueDate: any) => {
                                        //     return disableDate(valueDate)
                                        // }}
                                        value={getValues("arrivalDate")}
                                        onChange={(date) => {
                                            onChange(date)
                                        }}
                                        format={"MM-DD-YYYY"}
                                        className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                    />
                                }
                                control={control} defaultValue="" name={"arrivalDate"}
                            />
                        </div>
                        : ""}
                    { typeSubMenu === "departureDate" || typeSubMenu === 'edit-arr-de-date' ? 
                        <div className={`col-span-${typeSubMenu === 'edit-arr-de-date' ? 1 : 2}`}>
                            <label className={`${classes.title} m-0 font-base font-bold`}>Departure&apos;s Date: </label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <DatePicker
                                        clearIcon={false}
                                        disabledDate={(valueDate: any) => {
                                            return disableDate(valueDate)
                                        }}
                                        value={getValues("departureDate")}
                                        onChange={(date) => {
                                            onChange(date)
                                        }}
                                        format={"MM-DD-YYYY"}
                                        className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                    />
                                }
                                control={control} defaultValue="" name={"departureDate"}
                            />
                        </div>
                        : ""}
                    { typeSubMenu === 'comments' ? 
                        <div className="col-span-2">
                            <label className={`${classes.title} m-0 font-base font-bold`}>Comment&apos;s Group: </label>
                            <Controller 
                                as={<TextArea className={`${classes.textArea} w-full col-span-12`} 
                                    value={getValues("comments") || undefined}
                                    style={{ height: 140, backgroundColor: "#F5F6F7", borderRadius : 6 }} 
                                    placeholder="Input comment here" />
                                }
                                name="comments" defaultValue="" control={control} />
                        </div>
                        : ""}
                    { typeSubMenu === 'roomType' ? 
                        <div className="col-span-2">
                            <label className={`${classes.title} m-0 font-base font-bold`}>Room Type&apos;s Group: </label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md`}
                                        showSearch
                                        value={getValues("roomType")}
                                        onChange={(e) => {
                                            onChange(e)
                                        }}
                                        
                                        filterOption={(input: any, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option value=""> </Option>
                                        {numberOfRooms ? renderRoomType(numberOfRooms) : ""}
                                    </Select>
                                }
                                control={control} defaultValue="" name={"roomType"}
                            />
                        </div>
                        : ""}
                    { typeSubMenu === "confirmed" ? 
                        <div className="col-span-2">
                            <Controller render={({ onChange, onBlur, value, name, ref }) => (
                                <Checkbox style={{ height: "50%", float: 'left', color: "#00293B" }}
                                    className={`flex-row items-end font-base font-bold`}
                                    checked={getValues("confirmed")}
                                    onChange={(e) => onChange(e.target.checked)}

                                >
                                    Confirmed
                                </Checkbox>
                            )} name="confirmed" control={control} defaultValue={false} />
                        </div>
                        : ""}
                    { typeSubMenu === "cutOfDate" ?
                        <div className="col-span-2">
                            <label className={`${classes.title} m-0 font-base font-bold`}>Cut Of Date: </label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <DatePicker
                                        clearIcon={false}
                                        // disabledDate={(valueDate: any) => {
                                        //     return disableDate(valueDate)
                                        // }}
                                        value={getValues("cutOfDate")}
                                        onChange={(date) => {
                                            onChange(date)
                                        }}
                                        format={"MM-DD-YYYY"}
                                        className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                    />
                                }
                                control={control} defaultValue="" name={"cutOfDate"}
                            />
                        </div>
                        : ""}
                    { typeSubMenu === "agentGuid" ?
                        <div className="col-span-2">
                            <label className={`${classes.title} m-0 font-base font-bold`}>Agent&apos;s Group: </label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md`}
                                        showSearch
                                        value={getValues("companyAgentGuid")}
                                        onChange={(e) => {
                                            onChange(e)
                                        }}
                                        onSearch={onSearch}
                                        filterOption={false}
                                    >
                                        <Option value=""> </Option>
                                        {filteredCompanyProfile ? renderSelect(filteredCompanyProfile.filter(x => x.kind === 1)) : ""}
                                    </Select>
                                }
                                control={control} defaultValue="" name={"companyAgentGuid"}
                            />
                        </div>
                        : ""}
                    { typeSubMenu === "companyGuid" ?
                        <div className="col-span-2">
                            <label className={`${classes.title} m-0 font-base font-bold`}>Company&apos;s Group: </label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md`}
                                        showSearch
                                        value={getValues("companyAgentGuid")}
                                        onChange={(e) => {
                                            onChange(e)
                                        }}
                                        onSearch={onSearch}
                                        filterOption={false}
                                    >
                                        <Option value=""> </Option>
                                        {filteredCompanyProfile ? renderSelect(filteredCompanyProfile.filter(x => x.kind === 0)) : ""}
                                    </Select>
                                }
                                control={control} defaultValue="" name={"companyAgentGuid"}
                            />
                        </div>
                        : ""}
                </form>
            }
        />
    );
};

export default React.memo(FuncEditGroup);