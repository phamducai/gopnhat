import { Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { TypeStatusMessage, typeTracerTo } from 'common/enum/cashier.enum';
import { IMessage, IMessageByOption, IMessageTable } from 'common/model-rsvn';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModelTracerMessage from 'components/CModalAlert/CModalTracerMessage';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
    showInfoMessage?: IMessageTable
    checkShowInfo?: boolean
}

export const MessageModal = ({setIsAlertModal, isAlertModal, titleAlert, typeTracer = 0, inHouseGuid, guest,
    dateFrom, dateUtil, setIsNewTracer, setIsTracerTo, flagType, checkShowInfo, showInfoMessage} : PropsAlertModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { handleSubmit, control } = useForm();
    const {hotelId} = useSelectorRoot(state => state.app)
    const user = Utils.getValueLocalStorage("username")

    const [isMessage, setIsMessage] = useState<boolean>(false)

    const onCancel = () => {
        setIsAlertModal(false)
        setIsNewTracer && setIsNewTracer(false)
        setIsTracerTo && setIsTracerTo(false)
    }
    
    const onSubmit = handleSubmit(async (dataForm: IMessage) => {
        if(checkShowInfo){
            setIsAlertModal(false)
        }else{
            if(!dataForm.message) {
                setIsMessage(true)
            }else {
                if(inHouseGuid && guest){
                    if(typeTracer > typeTracerTo.GuestSameDeparture){
                        if(dateFrom && dateUtil ){
                            const data: IMessageByOption = { 
                                postingMessageCommon: {
                                    type: typeTracer,
                                    dateFrom:  Utils.formatDateCallApi(dateFrom),
                                    dateTo: Utils.formatDateCallApi(dateUtil)
                                },
                                dataFomessageCreateDTO: {
                                    ...dataForm,
                                    status: TypeStatusMessage.Unread,
                                    inHouseGuid: inHouseGuid,
                                    hotelGuid: hotelId,
                                    flagType: flagType,
                                    nguoiGui: user
                                }
                            }
                            await MiscellaneousService.PostMessageByType(data)
                        }
                    }else{
                        const data: IMessageByOption = { 
                            postingMessageCommon: {
                                type: typeTracer,
                                dateFrom: null,
                                dateTo: null
                            },
                            dataFomessageCreateDTO: {
                                ...dataForm,
                                status: TypeStatusMessage.Unread,
                                inHouseGuid: inHouseGuid,
                                hotelGuid: hotelId,
                                flagType: flagType,
                                nguoiGui: user
                            }
                        }
                        await MiscellaneousService.PostMessageByType(data)
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
                    <form onSubmit={onSubmit} id="form-service">
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
                                    control={control} defaultValue={showInfoMessage ? showInfoMessage.ngayThang : new Date()} />
                            </div>
                            <div className="col-span-6">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.SEARCHVALUE.from")}:
                                </label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            className={`${classes.input}`}
                                            type="text" style={{ background: "#F5F6F7", height: 50 }}
                                            value={value} 
                                            onChange={(e) => onChange(e.target.value)} >
                                        </Input>}
                                    name="nguoiNhan" control={control} defaultValue={showInfoMessage ? showInfoMessage.nguoiNhan :""} />
                            </div>
                            <div className="col-span-12">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.subject")}:
                                </label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            className={`${classes.input}`}
                                            type="text" style={{ background: "#F5F6F7", height: 50 }}
                                            value={value} 
                                            onChange={(e) => onChange(e.target.value)} >
                                        </Input>}
                                    name="messageSubject" control={control} defaultValue={showInfoMessage ? showInfoMessage.messageSubject :""} />
                            </div>
                            <div className="col-span-12">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.message")}:
                                </label>
                                <Controller render={({ onChange, value, ref }) =>
                                    <TextArea className={`${classes.textArea} w-full col-span-12`} 
                                        style={{ height: 80, backgroundColor: "#F5F6F7", borderRadius: 6,
                                            borderColor: isMessage? "red" : ""
                                        }} 
                                        placeholder="Input comment here" 
                                        required 
                                        value={value}
                                        onChange={(e) => {onChange(e.target.value)
                                            setIsMessage(false)
                                        }}
                                    />
                                } name="message" defaultValue={showInfoMessage ? showInfoMessage.message : ""} control={control} required />
                                {isMessage ? <p style={{color: "red"}}>Please input your message! </p> : ""}
                            </div>
                            <div className="col-span-12">
                                <label className="m-0 font-base font-bold">
                                    {t("BOOKING.comment")}:
                                </label>
                                <Controller render={({ onChange, value, ref }) =>
                                    <TextArea className={`${classes.textArea} w-full col-span-12`} 
                                        style={{ height: 60, backgroundColor: "#F5F6F7", borderRadius: 6 }} 
                                        placeholder="Input comment here" 
                                        onChange={(e) => onChange(e.target.value) }
                                    />
                                }
                                name="comment" defaultValue={showInfoMessage ? showInfoMessage.comment : ""} control={control}
                                />
                            </div>
                        </div>
                    </form>
                }
            />
        </div>
    );
}
