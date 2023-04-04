import { Button, Input, Modal, Radio, Select } from 'antd';
import { ITableMoveFolio } from 'common/cashier/model-folio';
import { IFormSearch } from 'common/define-booking';
import { ReservationStatus } from 'common/enum/booking.enum';
import { TypeTracer, typeTracerTo } from 'common/enum/cashier.enum';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CIconSvg from 'components/CIconSvg';
import CModel from 'components/CModal';
import CTableQuickSearch from 'components/CTable/CTableQuickSearch';
import useWindowSize from 'hooks/useWindowSize';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { searchRequest, searchWithQueryParam } from 'redux/controller';
import { useSelectorRoot } from 'redux/store';
import CashierService from 'services/cashier/cashier.service';
import { useStyleTheme } from 'theme';
import { AlertModal } from './CModalAlert';
import { MessageModal } from './CModalMessage';

interface PropsTracerMessageModal {
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    isTracer: boolean
}
const { Option } = Select;
export const TracerMessageModal = ({setIsShowModal, isShowModal, title, isTracer} : PropsTracerMessageModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { control, handleSubmit } = useForm();
    const {hotelId, numberOfRooms} = useSelectorRoot(state => state.app)
    const { filteredCompanyProfile } = useSelectorRoot(state => state.rsvn);
    const dispatch = useDispatch()
    const size = useWindowSize();

    const [pageSize, setPageSize] = useState<number>(CashierService.getPageSizeMove(size));
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [typeTracer, setTypeTracer] = useState<number>(typeTracerTo.GuestOnly);
    const [isAlertModal, setIsAlertModal] = useState<boolean>(false);
    const [isTracerToModal, setIsTracerToModal] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<ITableMoveFolio[]>([])
    const [arrivalDate, setArrivalDate] = useState<Date>(new Date())
    const [departureDate, setDepartureDate] = useState<Date>(new Date())
    const [, setIsClick] = useState<boolean>(false)

    useEffect(() => {
        const newPageSize = CashierService.getPageSizeMove(size)
        setPageSize(newPageSize);
        //eslint-disable-next-line
    }, [size])

    const onCancel = () => {
        setIsShowModal(false)
    }
    
    useEffect(() => {
        onSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, pageSize])

    const onSearch = handleSubmit(async (formSearch: IFormSearch) => {
        const data = {
            pageNumber: pageNumber,
            pageSize:  pageSize,
            hotelGuid: hotelId,
            isOnlyMainGuest: formSearch.isOnlyMainGuest,
            arrivalDates: formSearch.dateArrival,
            departureDates: formSearch.dateDeparture,
            companyAgentGuid: formSearch.companyAgent ? formSearch.companyAgent : '00000000-0000-0000-0000-000000000000',
            status: formSearch.searchBy ? formSearch.searchBy : ReservationStatus.CheckIn,
            rsvnCode: '',
            rsvnId: '00000000-0000-0000-0000-000000000000',
            rsvnNo: formSearch.rsvn,
            room: formSearch.room,
            availableDate: formSearch?.availableDate,
            profiles: {
                phone: formSearch.phone,
                passport: formSearch.passport,
                firstName: formSearch.firstName,
                guestName: formSearch.guestName
            },
            roomType: formSearch.roomType,
            groupCode: formSearch.groupCode,
            listRoomType: numberOfRooms //roomType
        }
        if (!formSearch?.firstName && !formSearch?.guestName && !formSearch?.passport && !formSearch?.phone) {
            dispatch(searchWithQueryParam({ ...data, profileIds: [] }))
        } else {
            dispatch(searchRequest(data))
        }
    })

    const handleOk = () => {
        setIsTracerToModal(true)
    }
    
    const handleOkTracerTo = () => {
        setIsAlertModal(true)
    }
    const onCancelTracerTo = () => {
        setIsTracerToModal(false)
    }
    const handleSelectGuest =(selectedRows: ITableMoveFolio[]) => {
        setSelectedRow(selectedRows)
    }

    return (
        <div className="custom-scrollbar-pkm" style={{ height: `calc(100vh - ${600}px)` }}>
            <CModel
                visible={isShowModal}
                title={title}
                onCancel={onCancel}
                width={"60%"}
                style={{top: "1%"}}
                onOk={() => handleOk()}
                disableBtn={selectedRow.length !==1 ? true : false}
                content={
                    <>
                        <form id="formQuickSearch" onSubmit={onSearch} className="custom-scrollbar-pkm" >
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-2">
                                    <label className="m-0 font-base font-bold">
                                        {t("BOOKING.roomNo")}:
                                    </label>
                                    <Controller
                                        render={({ onChange, value, ref }) =>
                                            <Input
                                                className={`${classes.input}`}
                                                type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                value={value} 
                                                onChange={(e) => onChange(e.target.value)} >
                                            </Input>}
                                        name="room" control={control} defaultValue={""} />
                                </div>
                                <div className="col-span-2">
                                    <label className="m-0 font-base font-bold">
                                        {t("BOOKING.rsvnNo")}:
                                    </label>
                                    <Controller
                                        render={({ onChange, value, ref }) =>
                                            <Input
                                                className={`${classes.input}`}
                                                type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                value={value} 
                                                onChange={(e) => onChange(e.target.value)} >
                                            </Input>}
                                        name="rsvn" control={control} defaultValue={""} />
                                </div>
                                <div className="col-span-2">
                                    <label className="m-0 font-base font-bold">
                                        {t("BOOKING.RESERVATION.groupCode")}:
                                    </label>
                                    <Controller
                                        render={({ onChange, value, ref }) =>
                                            <Input
                                                className={`${classes.input}`}
                                                type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                value={value} 
                                                onChange={(e) => onChange(e.target.value)} >
                                            </Input>}
                                        name="groupCode" control={control} defaultValue={""} />
                                </div>
                                <div className={`col-span-6 flex items-center justify-center pt-5`}>
                                    <Controller render={(
                                        { onChange }) => (
                                        <Radio.Group
                                            className={`font-semibold text-base mt-4`}
                                            onChange={e => { 
                                                onChange(e.target.value); 
                                            }}
                                            defaultValue={ReservationStatus.CheckIn}
                                        >
                                            <Radio value={ReservationStatus.CheckIn}>{t("BOOKING.inHouse")}</Radio>
                                            <Radio value={ReservationStatus.WaitingList}>{t("BOOKING.all")}</Radio>
                                            <Radio value={ReservationStatus.CheckOut}>{t("BOOKING.history")}</Radio>
                                            <Radio value={3}>{t("BOOKING.coInDay")}</Radio>
                                        </Radio.Group>
                                    )}
                                    name="searchBy" defaultValue={0} control={control} />
                                </div>
                                <div className="col-span-3">
                                    <label className="m-0 font-base font-bold">
                                        {t("BOOKING.firstname")}:
                                    </label>
                                    <Controller
                                        render={({ onChange, value, ref }) =>
                                            <Input
                                                className={`${classes.input}`}
                                                type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                value={value} 
                                                onChange={(e) => onChange(e.target.value)} >
                                            </Input>}
                                        name="firstName" control={control} defaultValue={""} />
                                </div>
                                <div className="col-span-3">
                                    <label className="m-0 font-base font-bold">
                                        {t("BOOKING.lastname")}:
                                    </label>
                                    <Controller
                                        render={({ onChange, value, ref }) =>
                                            <Input
                                                className={`${classes.input}`}
                                                type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                value={value} 
                                                onChange={(e) => onChange(e.target.value)} >
                                            </Input>}
                                        name="lastName" control={control} defaultValue={""} />
                                </div>
                                <div className="col-span-4">
                                    <label className="m-0 font-base font-bold">
                                        {t("BOOKING.company")}/{t("BOOKING.agent")}:
                                    </label>
                                    <Controller
                                        render={({ onChange, value, ref }) =>
                                            <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                                showSearch
                                                value={value}
                                                defaultValue={'hello'}
                                                onChange={(e) => {onChange(e)}}
                                            >
                                                <Option key={0} value={""}>{""}</Option>
                                                {filteredCompanyProfile ? filteredCompanyProfile.map((item, index) => {
                                                    return (
                                                        <Option value={item.guid} key={item.id}>{item.ten}</Option>
                                                    )
                                                }) : ""
                                                }
                                            </Select>
                                        }
                                        name="companyAgent" control={control} defaultValue={''}/>
                                </div>
                                <div className="col-span-2 flex items-center justify-center">
                                    <Button
                                        type="primary" htmlType="submit"
                                        className={`!rounded-md w-5/6 mt-5`}
                                        style={{height: 40}}
                                        onClick={() => onSearch()}
                                        form='formQuickSearch'
                                    >
                                        {t("BOOKING.RESERVATION.EDITRESERVATION.search")}
                                    </Button>
                                </div>
                            </div>
                        </form>
                        <div className="mt-4">
                            <CTableQuickSearch
                                height={350}
                                handleSelectGuest={handleSelectGuest}
                                guestGuid={""}
                                setPageNumber={setPageNumber}
                                setPageSize={setPageSize}
                            />
                        </div>
                        {isTracerToModal && <Modal
                            title={<span className={`${classes.titleStyle}`}>{t("BOOKING.RESERVATION.newTracerTo")}</span>}
                            visible={isTracerToModal}
                            destroyOnClose={true}
                            className={classes.antModalStyle}
                            closeIcon={<CIconSvg name="close-drawer" hexColor="#F74352" svgSize="default" onClick={() => onCancel()} />}
                            width={"50%"}
                            style={{top: '5%'}}
                            footer={
                                <div className="flex justify-between m-auto w-full">
                                    <div className="footer-left">
                                    </div>
                                    <div className="footer-right">
                                        <Button
                                            style={{ color: "#F74352", border: "1px solid #F74352" }}
                                            className={`!rounded-md ${classes.buttonStyle}`}
                                            // disabled={disableClose}
                                            onClick={() => onCancelTracerTo()}
                                        >
                                            {t("BOOKING.RESERVATION.EDITRESERVATION.close")}
                                        </Button >
                                        <Button
                                            type="primary" 
                                            className={`!rounded-md ${classes.buttonStyle}`}
                                            onClick={handleOkTracerTo}
                                        >
                                            {t("BOOKING.RESERVATION.ok")}
                                        </Button>
                                    </div>
                                </div >
                            }
                        >
                            <div >
                                <Controller
                                    control={control}
                                    defaultValue={typeTracerTo.GuestOnly}
                                    name="typeDate"
                                    render={({ onChange }) => (
                                        <Radio.Group
                                            className={`${classes.radioGroup} font-semibold text-base`}
                                            onChange={e => { 
                                                onChange(e.target.value); 
                                                setTypeTracer(e.target.value)
                                            }}
                                            defaultValue={typeTracerTo.GuestOnly}
                                        >
                                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} 
                                                value={typeTracerTo.GuestOnly}>{t("BOOKING.guestOnly")}</Radio>
                                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} 
                                                value={typeTracerTo.AllGuestInGroup}>{t("BOOKING.allGuestInGroup")}</Radio>
                                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} 
                                                value={typeTracerTo.GuestSameArrival}>{t("BOOKING.guestSameArrival")}</Radio>
                                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} 
                                                value={typeTracerTo.GuestSameDeparture}>{t("BOOKING.guestSameDeparture")}</Radio>
                                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} 
                                                value={typeTracerTo.GuestInHouseBetween}>
                                                <span>{t("BOOKING.guestInHouse")}</span>
                                                <Controller
                                                    name="dateArrival1"
                                                    control={control} render={({ onChange, value }) => (
                                                        <div className="inline-flex items-center ">
                                                            <DatePicker
                                                                defaultValue={arrivalDate}
                                                                onClick={() => onChange({ ...value, isOpen: false })}
                                                                placeholder={t("BOOKING.SEARCHVALUE.from")}
                                                                className={`${classes.datePicker} w-2/7`}
                                                                format={Utils.typeFormatDate()}
                                                                disabledDate={(date) => (date) && date < new Date()}
                                                                onChange={(date) => {
                                                                    onChange({ ...value, from: date, isOpen: true })
                                                                    date && setArrivalDate(date)
                                                                }
                                                                }
                                                            />
                                                            <div style={{ width: "40px", padding: "7px 4px" }} className="font-bold flex justify-center"> and </div>
                                                            <DatePicker
                                                                defaultValue={departureDate}
                                                                onClick={() => { onChange({ ...value, isOpen: true }); setIsClick(true) }}
                                                                onBlur={() => { onChange({ ...value, isOpen: false }); ; setIsClick(false) }}
                                                                open={value?.isOpen} placeholder={t("BOOKING.SEARCHVALUE.to")}
                                                                disabledDate={(date) => (date && value?.from) && date < value?.from}
                                                                className={`${classes.datePicker} w-2/7`}
                                                                format={Utils.typeFormatDate()}
                                                                onChange={(date) => {
                                                                    onChange({ ...value, to: date, isOpen: false })
                                                                    date && setDepartureDate(date)
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </Radio>
                                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} value={typeTracerTo.GuestArrivalBetween}>
                                                <span>{t("BOOKING.guestArrivalBetween")}</span>
                                                <Controller
                                                    name="dateArrival2"
                                                    control={control} render={({ onChange, value }) => (
                                                        <div className="inline-flex items-center ">
                                                            <DatePicker
                                                                defaultValue={arrivalDate}
                                                                onClick={() => onChange({ ...value, isOpen: false })}
                                                                placeholder={t("BOOKING.SEARCHVALUE.from")}
                                                                className={`${classes.datePicker} w-2/7`}
                                                                format={Utils.typeFormatDate()}
                                                                disabledDate={(date) => (date) && date < new Date()}
                                                                onChange={(date) => {
                                                                    onChange({ ...value, from: date, isOpen: true })
                                                                    date && setArrivalDate(date)
                                                                }
                                                                }
                                                            />
                                                            <div style={{ width: "40px", padding: "7px 4px" }} className="font-bold flex justify-center"> and </div>
                                                            <DatePicker
                                                                defaultValue={departureDate}
                                                                onClick={() => { onChange({ ...value, isOpen: true }); setIsClick(true) }}
                                                                onBlur={() => { onChange({ ...value, isOpen: false }); ; setIsClick(false) }}
                                                                open={value?.isOpen} placeholder={t("BOOKING.SEARCHVALUE.to")}
                                                                disabledDate={(date) => (date && value?.from) && date < value?.from}
                                                                className={`${classes.datePicker} w-2/7`}
                                                                format={Utils.typeFormatDate()}
                                                                onChange={(date) => {
                                                                    onChange({ ...value, to: date, isOpen: false })
                                                                    date && setDepartureDate(date)
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </Radio>
                                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} value={typeTracerTo.GuestDepartureBetween}>
                                                <span>{t("BOOKING.guestDepartureBetween")}</span>
                                                <Controller
                                                    name="dateArrival3"
                                                    control={control} render={({ onChange, value }) => (
                                                        <div className="inline-flex items-center ">
                                                            <DatePicker
                                                                defaultValue={arrivalDate}
                                                                onClick={() => onChange({ ...value, isOpen: false })}
                                                                placeholder={t("BOOKING.SEARCHVALUE.from")}
                                                                className={`${classes.datePicker} w-2/7`}
                                                                format={Utils.typeFormatDate()}
                                                                disabledDate={(date) => (date) && date < new Date()}
                                                                onChange={(date) => {
                                                                    onChange({ ...value, from: date, isOpen: true })
                                                                    date && setArrivalDate(date)
                                                                }
                                                                }
                                                            />
                                                            <div style={{ width: "40px", padding: "7px 4px" }} className="font-bold flex justify-center"> and </div>
                                                            <DatePicker
                                                                defaultValue={departureDate}
                                                                onClick={() => { onChange({ ...value, isOpen: true }); setIsClick(true) }}
                                                                onBlur={() => { onChange({ ...value, isOpen: false }); ; setIsClick(false) }}
                                                                open={value?.isOpen} placeholder={t("BOOKING.SEARCHVALUE.to")}
                                                                disabledDate={(date) => (date && value?.from) && date < value?.from}
                                                                className={`${classes.datePicker} w-2/7`}
                                                                format={Utils.typeFormatDate()}
                                                                onChange={(date) => {
                                                                    onChange({ ...value, to: date, isOpen: false })
                                                                    date && setDepartureDate(date)
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </Radio>
                                        </Radio.Group>
                                    )}
                                />
                            </div>
                        </Modal >
                        }
                        {isTracer ? isAlertModal && <AlertModal
                            titleAlert={t("BOOKING.RESERVATION.inputMessage")}
                            isAlertModal={isAlertModal}
                            setIsAlertModal={setIsAlertModal}
                            typeTracer={typeTracer}
                            inHouseGuid={selectedRow[0].guid}
                            guest={selectedRow[0].guestId}
                            dateFrom={arrivalDate}
                            dateUtil={departureDate}
                            setIsTracerTo={setIsTracerToModal}
                            setIsNewTracer={setIsShowModal}
                            flagType={TypeTracer.Tracer}
                        /> : 
                            isAlertModal && <MessageModal
                                titleAlert={t("BOOKING.RESERVATION.inputMessage")}
                                isAlertModal={isAlertModal}
                                setIsAlertModal={setIsAlertModal}
                                typeTracer={typeTracer}
                                inHouseGuid={selectedRow[0].guid}
                                guest={selectedRow[0].guestId}
                                dateFrom={arrivalDate}
                                dateUtil={departureDate}
                                setIsTracerTo={setIsTracerToModal}
                                setIsNewTracer={setIsShowModal}
                                flagType={TypeTracer.Tracer}
                            />
                        }
                    </>
                }
            />
            
        </div>
    );
}
