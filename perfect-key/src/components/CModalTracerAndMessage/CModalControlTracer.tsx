/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { TypeTracer } from 'common/enum/cashier.enum';
import { ITracerMessageTable, SearchQueryTracerMessage } from 'common/model-rsvn';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CTableControl from 'components/CTable/CTableControl';
import { subDays } from 'date-fns';
import useWindowSize from 'hooks/useWindowSize';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { searchTracerMessageReq } from 'redux/controller/booking.slice';
import { useSelectorRoot } from 'redux/store';
import CashierService from 'services/cashier/cashier.service';
import FrontDeskService from 'services/frontdesk/frontdesk.service';
import MiscellaneousService from 'services/miscellaneous/miscellaneous.service';
import { useStyleTheme } from 'theme';
import CModelControl from '../CModalAlert/CModalControl';
import { AlertModal } from './CModalAlert';

interface PropsControlTracerModal {
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
}
export const ControlTracerModal = ({setIsShowModal, isShowModal, title} : PropsControlTracerModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { control, handleSubmit } = useForm();
    const {hotelId} = useSelectorRoot(state => state.app)
    const {dataSearchTracerMessage } = useSelectorRoot(state => state.booking);
    const dispatch = useDispatch()
    const size = useWindowSize();
    const { t } = useTranslation("translation")
    // const user = Utils.getValueLocalStorage("username")
    
    const [pageSize, setPageSize] = useState<number>(CashierService.getPageSizeMove(size));
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [selectedRow, setSelectedRow] = useState<ITracerMessageTable>()
    const [isDisableBtnResolve, setIsDisableBtnResolve] = useState(true)
    const [isVisibleRes, setIsVisibleRes] = useState(false)
    const [isAlertModal, setIsAlertModal] = useState<boolean>(false);
    const [selectedInfo, setSelectedInfo] = useState<ITracerMessageTable>()

    useEffect(() => {
        const newPageSize = CashierService.getPageSizeMove(size)
        setPageSize(newPageSize);
    }, [size])

    useEffect(() => {
        onSubmit()
    },[pageSize])

    const onCancel = () => {
        setIsShowModal(false)
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = handleSubmit(async (data: any) => {
        const dataSearch: SearchQueryTracerMessage = {
            arrivalDate: data.arrivalDate ? Utils.convertMiddleDate(data.arrivalDate.from) : Utils.convertMiddleDate(subDays(new Date(),1)),
            departureDate: data.arrivalDate ? Utils.convertMiddleDate(data.arrivalDate.to) : Utils.convertMiddleDate(new Date()),
            department: data.department,
            hotelGuid: hotelId,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        const res = await MiscellaneousService.getDataSearchTracerMessage(dataSearch)
        dispatch(searchTracerMessageReq(res))
    })

    const handleMarkAsRes = () => {
        Modal.confirm({
            title: 'Do you want to mark this tracer as Resolved?',
            content: '',
            className: "custom-modal-confirm-pkm",
            async onOk() {
                if(selectedRow){
                    const data = dataSearchTracerMessage.find((item) => item.id === selectedRow.id)
                    if(data){
                        await FrontDeskService.SeenMessageAlert(data)
                        onSubmit()
                    }
                }
            }
        });
    }

    const handleSelectedTracerMessage = (record: ITracerMessageTable[]) => {
        if(record[0].check === 1){
            setIsDisableBtnResolve(true)
            setIsVisibleRes(false)
        }else{
            setIsDisableBtnResolve(false)
            setIsVisibleRes(true)
        }
        record && setSelectedRow(record[0])
    }
    const handleInfoTracer = (record: ITracerMessageTable) => {
        setSelectedInfo(record)
        setIsAlertModal(true)
    }

    return (
        <div className="custom-scrollbar-pkm" style={{ height: `calc(100vh - ${600}px)` }}>
            <CModelControl
                visible={isShowModal}
                title={title}
                onCancel={onCancel}
                myForm="form-service"
                width={"65%"}
                style={{top: "1%"}}
                onRes={handleMarkAsRes}
                disableBtn={isDisableBtnResolve}
                visibleRes={isVisibleRes}
                content={
                    <>
                        <CTableControl
                            height={395}
                            handleSelected={handleSelectedTracerMessage}
                            showInfo={handleInfoTracer}
                            guestGuid={""}
                            setPageNumber={setPageNumber}
                        />
                        <div className="grid grid-cols-12 gap-4 mt-2">
                            <div className="col-span-8"> 
                                <TextArea disabled={selectedRow ? false : true} style={{height: 190}} className={`${classes.input} w-full`}
                                    value={selectedRow && selectedRow.messageSubject}
                                />
                            </div>
                            <div className="col-span-4"> 
                                <form id="form-service" onSubmit={onSubmit} className="custom-scrollbar-pkm" >
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-12">
                                            <label className="m-0 font-base font-bold">
                                                {t("BOOKING.department")}:
                                            </label>
                                            <Controller
                                                render={({ onChange, value, ref }) =>
                                                    <Input
                                                        className={`${classes.input}`}
                                                        type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                        value={value} 
                                                        onChange={(e) => onChange(e.target.value)} >
                                                    </Input>}
                                                name="department" control={control} defaultValue={""} />
                                        </div>
                                        <div className="col-span-12">
                                            <label className={"font-semibold"}>{t("BOOKING.RESERVATION.EDITRESERVATION.dateFrom")}:</label>
                                            <label className={"font-semibold"} style={{marginLeft: "26%"}}>{t("BOOKING.RESERVATION.EDITRESERVATION.dateTo")}:</label>
                                            <Controller
                                                name="arrivalDate"
                                                control={control} render={({ onChange, value }) => (
                                                    <div className="inline-flex items-center ">
                                                        <DatePicker
                                                            defaultValue={subDays(new Date(), 1)}
                                                            onClick={() => onChange({ ...value, isOpen: false })}
                                                            placeholder={t("BOOKING.SEARCHVALUE.from")}
                                                            className={`${classes.datePicker} w-2/7`}
                                                            format={Utils.typeFormatDate()}
                                                            onChange={(date) => {
                                                                onChange({ ...value, from: date, isOpen: true })
                                                            }
                                                            }
                                                        />
                                                        <div style={{ width: "20px", padding: "7px 4px" }} 
                                                            className="font-bold flex justify-center"> ~ </div>
                                                        <DatePicker
                                                            defaultValue={new Date()}
                                                            onClick={() => { onChange({ ...value, isOpen: true }); }}
                                                            onBlur={() => { onChange({ ...value, isOpen: false }); }}
                                                            open={value?.isOpen} placeholder={t("BOOKING.SEARCHVALUE.to")}
                                                            disabledDate={(date) => (date && value?.from) && date < value?.from}
                                                            className={`${classes.datePicker} w-2/7`}
                                                            format={Utils.typeFormatDate()}
                                                            onChange={(date) => {
                                                                onChange({ ...value, to: date, isOpen: false })
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            />   
                                        </div>
                                        
                                        <div className="col-span-12 flex justify-end">
                                            <Button type="primary" htmlType="button"
                                                className={`!rounded-md w-full`}
                                                style={{height: 35}}
                                                onClick={() => onSubmit()}
                                            >
                                                {t("MISCELLANEOUS.select")}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            {isAlertModal && <AlertModal
                                titleAlert={t("BOOKING.RESERVATION.inputMessage")}
                                isAlertModal={isAlertModal}
                                setIsAlertModal={setIsAlertModal}
                                inHouseGuid={selectedInfo ? selectedInfo.inHouseGuid : null}
                                guest={selectedInfo ? selectedInfo.guest : null}
                                flagType={TypeTracer.Tracer}
                                showInfoTracer={selectedInfo}
                                checkShowInfo={true}
                            />
                            }
                        </div>
                    </>
                }
            />
        </div>
    );
}
