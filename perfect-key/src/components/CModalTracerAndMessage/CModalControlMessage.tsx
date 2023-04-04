import { Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { TypeTracer } from 'common/enum/cashier.enum';
import { IDataSearchMessage, IMessageTable, SearchQueryMessage } from 'common/model-rsvn';
import Utils from 'common/utils';
import CModelControl from 'components/CModalAlert/CModalControl';
import CTableControlMessage from 'components/CTable/CTableControlMessage';
import { subDays } from 'date-fns';
import useWindowSize from 'hooks/useWindowSize';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { searchMessageReq } from 'redux/controller';
import { useSelectorRoot } from 'redux/store';
import CashierService from 'services/cashier/cashier.service';
import MiscellaneousService from 'services/miscellaneous/miscellaneous.service';
import { useStyleTheme } from 'theme';
import { MessageModal } from './CModalMessage';

interface PropsControlMessageModal {
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    arrivalDate: Date,
    departureDate: Date
}
export const ControlMessageModal = ({setIsShowModal, isShowModal, title, arrivalDate, departureDate} : PropsControlMessageModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { control } = useForm();
    const {hotelId} = useSelectorRoot(state => state.app)
    const { dataSearchMessage } = useSelectorRoot(state => state.booking);
    const dispatch = useDispatch()
    const { t } = useTranslation("translation");
    const size = useWindowSize();

    const [pageSize, setPageSize] = useState<number>(CashierService.getPageSizeMove(size));
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [selectedRow, setSelectedRow] = useState<IMessageTable>()
    const [isAlertModal, setIsAlertModal] = useState<boolean>(false);
    const [selectedInfo, setSelectedInfo] = useState<IMessageTable>()
    const [isDisableBtnResolve, setIsDisableBtnResolve] = useState(true)
    const [isVisibleRes, setIsVisibleRes] = useState(false)
    const [dataTableMessage, setDataTableMessage] = useState<IDataSearchMessage[]>([])
    
    useEffect(() => {
        const newPageSize = CashierService.getPageSizeMove(size)
        setPageSize(newPageSize);
    }, [size])

    useEffect(() => {
        handleSearchMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const handleSearchMessage = async () => {
        const dataSearch: SearchQueryMessage = {
            arrivalDate: arrivalDate ? Utils.formatDateCallApi(arrivalDate) : subDays(new Date(),1),
            departureDate: departureDate ? Utils.convertEndDate(departureDate) : Utils.convertMiddleDate(new Date()),
            hotelGuid: hotelId,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        const res = await MiscellaneousService.getDataSearchMessage(dataSearch)
        setDataTableMessage(res)
        dispatch(searchMessageReq(res))
    }
    
    const onCancel = () => {
        setIsShowModal(false)
    }

    const handleInfoMessage = (record: IMessageTable) => {
        setSelectedInfo(record)
        setIsAlertModal(true)
    }

    const handleSelectGuest =(selectedRows: IMessageTable) => {
        if(selectedRows.check === 1){
            setIsDisableBtnResolve(true)
            setIsVisibleRes(false)
        }else{
            setIsDisableBtnResolve(false)
            setIsVisibleRes(true)
        }
        setSelectedRow(selectedRows)
    }

    const handleMarkAsRes = () => {
        Modal.confirm({
            title: 'Do you want to mark this message as Resolved?',
            content: '',
            className: "custom-modal-confirm-pkm",
            async onOk() {
                if(selectedRow){
                    const dataUpdate = dataSearchMessage.find(item => item.dataFomessage.id === selectedRow?.id)
                    if(dataUpdate){
                        await MiscellaneousService.UpdateSeenMessage(dataUpdate.dataFomessage)
                        handleSearchMessage()
                    }
                }
            }
        });
    }

    return (
        <div className="custom-scrollbar-pkm" style={{ height: `calc(100vh - ${600}px)` }}>
            <CModelControl
                visible={isShowModal}
                title={title}
                onCancel={onCancel}
                myForm="form-service"
                width={"70%"}
                style={{top: "1%"}}
                onRes={handleMarkAsRes}
                disableBtn={isDisableBtnResolve}
                visibleRes={isVisibleRes}
                content={
                    <>
                        <CTableControlMessage
                            height={410}
                            handleSelected={handleSelectGuest}
                            guestGuid={""}
                            showInfo={handleInfoMessage}
                            setPageNumber={setPageNumber}
                            dataTableMessage={dataTableMessage}
                        />
                        <div className="grid grid-cols-12 gap-4 mt-2">
                            <div className="col-span-8"> 
                                <div>{t("BOOKING.message")}:</div>
                                <Controller
                                    name="ghiChu" control={control} 
                                    render={({ onChange, value }) =>
                                        <TextArea style={{height: 180}} disabled={selectedRow ? false : true}
                                            value={selectedRow && selectedRow.message} 
                                            className={`${classes.input} w-full`} />
                                    }
                                />
                            </div>
                            <div className="col-span-4"> 
                                <div>{t("MISCELLANEOUS.template")}:</div>
                                <Controller
                                    defaultValue="" name="ghiChu" control={control}
                                    render={({ onChange, value }) =>
                                        <TextArea style={{height: 180}} disabled 
                                            className={`${classes.input} w-full`} />
                                    }
                                />
                            </div>
                        </div>
                        {isAlertModal && <MessageModal
                            titleAlert={t("BOOKING.RESERVATION.inputMessage")}
                            isAlertModal={isAlertModal}
                            setIsAlertModal={setIsAlertModal}
                            inHouseGuid={selectedInfo ? selectedInfo.inHouseGuid : null}
                            guest={null}
                            flagType={TypeTracer.Tracer}
                            checkShowInfo={true}
                            showInfoMessage={selectedInfo}
                        />}
                    </>
                }
            />
        </div>
    );
}
