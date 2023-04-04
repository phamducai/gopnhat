import { Checkbox, Input, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import HotelConfigApi from 'api/hcfg/hcfg.api';
import { TypeStatusMessage, TypeTracer, typeTracerTo } from 'common/enum/cashier.enum';
import { ITableLaundry } from 'common/model-hcfg';
import { ITracerMessage, ITracerMessageByOption, ITracerMessageTable } from 'common/model-rsvn';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModelTracerMessage from 'components/CModalAlert/CModalTracerMessage';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelectorRoot } from 'redux/store';
import MiscellaneousService from 'services/miscellaneous/miscellaneous.service';
import { useStyleTheme } from 'theme';

interface PropsAlertModal {
    isAlertModal: boolean;
    setIsAlertModal: React.Dispatch<React.SetStateAction<boolean>>,
    titleAlert: string,
    typeTracer?: number,
    inHouseGuid: string | null,
    guest: string | null,
    dateFrom?: Date,
    dateUtil?: Date,
    setIsNewTracer?: React.Dispatch<React.SetStateAction<boolean>>,
    setIsTracerTo?: React.Dispatch<React.SetStateAction<boolean>>,
    flagType: number,
    showInfoTracer?: ITracerMessageTable,
    checkShowInfo?: boolean
}
const { Option } = Select;
export const AlertModal = ({setIsAlertModal, isAlertModal, titleAlert, typeTracer = 0, inHouseGuid, guest,
    dateFrom, dateUtil, setIsNewTracer, setIsTracerTo, flagType, showInfoTracer, checkShowInfo = false} : PropsAlertModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { handleSubmit, control } = useForm();
    const {hotelId} = useSelectorRoot(state => state.app)
    const dispatch = useDispatch()
    const user = Utils.getValueLocalStorage("username")

    const [dateTracerFrom, setDateTracerFrom] = useState<Date>(new Date())
    const [listDepartment, setListDepartment] = useState<ITableLaundry[]>() 
    const [isMessage, setIsMessage] = useState<boolean>(false)

    useEffect(() => {
        const fetchDepartment = async () => {
            const res = await HotelConfigApi.getDmucDepartment(hotelId).toPromise()
            if(res) {
                setListDepartment(res)
            }
        }
        fetchDepartment()
    },[hotelId, dispatch])

    const onCancel = () => {
        setIsAlertModal(false)
        setIsNewTracer && setIsNewTracer(false)
        setIsTracerTo && setIsTracerTo(false)
    }
    
    const onSubmit = handleSubmit(async (dataForm: ITracerMessage) => {
        if(checkShowInfo){
            setIsAlertModal(false)
        }else{
            if(!dataForm.message) {
                setIsMessage(true)
            }else {
                if(inHouseGuid && guest){
                    //new tracer
                    if(flagType === TypeTracer.Tracer){
                        if(typeTracer > typeTracerTo.GuestSameDeparture){
                            if(dateFrom && dateUtil ){
                                const data: ITracerMessageByOption = {
                                    postingTracerCommon: {
                                        type: typeTracer,
                                        dateFrom:  Utils.formatDateCallApi(dateFrom),
                                        dateTo: Utils.formatDateCallApi(dateUtil)
                                    },
                                    dataFotracerMessageCreateDTO: {
                                        ...dataForm,
                                        status: TypeStatusMessage.Unread,
                                        inHouseGuid: inHouseGuid,
                                        guest: guest,
                                        hotelGuid: hotelId,
                                        flagType: flagType,
                                        userName: user
                                    }
                                }
                                await MiscellaneousService.PostTracerMessageByType(data)
                            }
                        }else{
                            const data: ITracerMessageByOption = { 
                                postingTracerCommon: {
                                    type: typeTracer,
                                    dateFrom: null,
                                    dateTo: null
                                },
                                dataFotracerMessageCreateDTO: {
                                    ...dataForm,
                                    status: TypeStatusMessage.Unread,
                                    inHouseGuid: inHouseGuid,
                                    guest: guest,
                                    hotelGuid: hotelId,
                                    flagType: flagType,
                                    userName: user
                                }
                            }
                            await MiscellaneousService.PostTracerMessageByType(data)
                        }
                    }else{
                        //new alert checkin / checkout
                        const data: ITracerMessageByOption = { 
                            postingTracerCommon: {
                                type: typeTracerTo.GuestOnly,
                                dateFrom: null,
                                dateTo: null
                            },
                            dataFotracerMessageCreateDTO: {
                                ...dataForm,
                                status: TypeStatusMessage.Unread,
                                inHouseGuid: inHouseGuid,
                                guest: guest,
                                hotelGuid: hotelId,
                                flagType: flagType,
                                userName: user
                            }
                        }
                        await MiscellaneousService.PostTracerMessageByType(data)
                    }
                    setIsAlertModal(false)
                    setIsNewTracer && setIsNewTracer(false)
                    setIsTracerTo && setIsTracerTo(false)
                }
            }
        }
    })
    
    return (
        <div className="custom-scrollbar-pkm" style={{ height: `calc(100vh - ${600}px)` }}>
            <CModelTracerMessage
                visible={isAlertModal}
                title={titleAlert}
                onCancel={onCancel}
                myForm="form-service"
                width={"50%"}
                style={{top: "3%"}}
                onOk={onSubmit}
                content={
                    <form onSubmit={onSubmit} id="form-service" className="custom-scrollbar-pkm pr-2" style={{ height: `calc(100vh - ${250}px)`}}>
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6 ">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.date")}:
                                </label>
                                <Controller
                                    name="ngayThang"
                                    render={({ onChange, value }) =>
                                        <DatePicker
                                            onChange={(date) => onChange(date)}
                                            defaultValue={new Date()}
                                            format="YYYY-MM-DD HH:mm"
                                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                            name="ngayThang"
                                            disabled
                                        />}
                                    control={control} defaultValue={showInfoTracer ? showInfoTracer.ngayThang : new Date()} />
                            </div>
                            <div className="col-span-6">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.tracerFrom")}:
                                </label>
                                <Controller
                                    name="dateFrom"
                                    render={({ onChange, value }) =>
                                        <DatePicker
                                            onChange={(date) => {
                                                onChange(date)
                                                date && setDateTracerFrom(date)
                                            }}
                                            defaultValue={new Date()}
                                            disabledDate={(date) => (date) && date < new Date()}
                                            format="YYYY-MM-DD HH:mm"
                                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                            name="dateFrom"
                                        />}
                                    control={control} defaultValue={showInfoTracer ? showInfoTracer.dateFrom : new Date()} />
                            </div>
                            <div className="col-span-6">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.tracerUntil")}:
                                </label>
                                <Controller
                                    name="dateTo"
                                    render={({ onChange, value }) =>
                                        <DatePicker
                                            onChange={(date) => {
                                                onChange(date)}}
                                            defaultValue={new Date()}
                                            format="YYYY-MM-DD HH:mm"
                                            disabledDate={(date) => date < dateTracerFrom}
                                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                            name="dateTo"
                                        />}
                                    control={control} defaultValue={showInfoTracer ? showInfoTracer.dateTo : new Date()} />
                            </div>
                            <div className="col-span-6">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.department")}:
                                </label>
                                {checkShowInfo ? 
                                    <Controller
                                        render={({ onChange, value, ref }) =>
                                            <Input
                                                className={`${classes.input}`}
                                                type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                value={value} 
                                                onChange={(e) => onChange(e.target.value)} >
                                            </Input>}
                                        name="department" control={control} defaultValue={showInfoTracer?.department} /> 
                                    : <Controller
                                        render={({ onChange, value, ref }) =>
                                            <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                                showSearch
                                                value={value}
                                                defaultValue={""}
                                                onChange={(e) => {onChange(e)}}
                                            >
                                                <Option key={0} value={""}>{""}</Option>
                                                {listDepartment ? listDepartment.map((item) => {
                                                    return (
                                                        <Option key={item.id} value={item.ten}>{item.ten}</Option>
                                                    )
                                                }) : ""
                                                }
                                            </Select>
                                            
                                        }
                                        name="department" control={control} defaultValue={""}/>
                                }
                            </div>
                            <div className="col-span-9">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.subject")}:
                                </label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            className={`${classes.input}`}
                                            type="text" style={{ background: "#F5F6F7", height: 40 }}
                                            value={value} 
                                            onChange={(e) => onChange(e.target.value)} >
                                        </Input>}
                                    name="messageSubject" control={control} defaultValue={showInfoTracer ? showInfoTracer.messageSubject : ""} />
                            </div>
                            <div className="col-span-3">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.RESERVATION.EDITRESERVATION.status")}:
                                </label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            className={`${classes.input}`}
                                            type="text" style={{ background: "#F5F6F7", height: 40 }}
                                            value={value} disabled
                                            onChange={(e) => onChange(e.target.value)} >
                                        </Input>}
                                    name="status" control={control} defaultValue={showInfoTracer ? showInfoTracer.status : "Unresolved"} />
                            </div>
                            <div className="col-span-12">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.message")}:
                                </label>
                                <Controller render={({ onChange, value, ref }) =>
                                    <TextArea className={`${classes.textArea} w-full col-span-12`} 
                                        style={{ height: 60, backgroundColor: "#F5F6F7", borderRadius: 6,
                                            borderColor: isMessage? "red" : ""
                                        }} 
                                        placeholder="Input comment here" 
                                        required 
                                        value={value}
                                        onChange={(e) => {onChange(e.target.value)
                                            setIsMessage(false)
                                        }}
                                    />
                                } name="message" control={control} required 
                                defaultValue={showInfoTracer ? showInfoTracer.message : ""}  />
                                {isMessage ? <p style={{color: "red"}}>Please input your message! </p> : ""}
                            </div>
                            <div className="col-span-12">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.comment")}:
                                </label>
                                <Controller render={({ onChange, value, ref }) =>
                                    <TextArea className={`${classes.textArea} w-full col-span-12`} 
                                        style={{ height: 45, backgroundColor: "#F5F6F7", borderRadius: 6 }} 
                                        placeholder="Input comment here" 
                                        value={value}
                                        onChange={(e) => onChange(e.target.value) }
                                    />
                                }
                                name="comment" defaultValue={showInfoTracer ? showInfoTracer.comment : ""} control={control}
                                />
                            </div>
                            <div className={`col-span-7 flex items-center`}>
                                <Controller render={(
                                    { onChange, onBlur, value, name, ref }) => (
                                    <Checkbox
                                        className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                        defaultChecked={false}
                                        onChange={(e) => {
                                            onChange(e.target.checked)
                                        }}>
                                        {t("BOOKING.notShowAgain")}
                                    </Checkbox>
                                )}
                                name="doNotShowAgain" defaultValue={false} control={control} />
                            </div>
                        </div>
                    </form>
                }
            />
        </div>
    );
}
