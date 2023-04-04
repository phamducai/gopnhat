/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, Divider, Radio } from 'antd';
import { IRunNightAudit } from 'common/end-of-day/model-runNight';
import { DateTypeStatus } from 'common/enum/report.enum';
import { ITableFixCharge } from 'common/model-booking';
import { IAccountDetailReport } from 'common/report/define-report';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import { addDays, subDays } from 'date-fns';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelectorRoot } from 'redux/store';
import PrintReportService from 'services/report/printReport.service';
import { useStyleTheme } from 'theme';
import TableAccountReport from './Table/TableAccountReport';

interface PropsAccountDetailReportModal {
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    onSubmitAccountDetail(data: IAccountDetailReport) : void,
    setSelectAccount: React.Dispatch<React.SetStateAction<string[]>>,
    isLoading: boolean
    selectAccount: string[]
}
const { RangePicker } = DatePicker;
export const AccountDetailReportModal = ({setIsShowModal, isShowModal, title, onSubmitAccountDetail,
    setSelectAccount, isLoading, selectAccount} : PropsAccountDetailReportModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { control, handleSubmit, setValue } = useForm();
    const {hotelId} = useSelectorRoot(state => state.app)
    const dispatch = useDispatch()

    const [isCheck, setIsCheck] = useState<boolean>(false);
    const [dataTable, setDataTable] = useState<ITableFixCharge[]>([]);
    const [selectedRowsArray, setSelectedRowsArray] = useState<React.Key[]>([]);
    const [isDisableDate, setIsDisableDate] = useState(true)
    const [auditDate, setAuditDate] = useState<Date[]>([new Date(), new Date()])
    const [changeDateTime, setChangeDateTime] = useState<Date[]>([new Date(), new Date()])

    useEffect(() => {
        const fetchDataAccount = async () => {
            const dataAccount = await PrintReportService.filterDataFixCharges(hotelId)
            setDataTable(dataAccount)
        }
        fetchDataAccount()
    },[hotelId, dispatch])

    useEffect(() => {
        const data: IRunNightAudit = {
            hotelGuid: hotelId,
            type: 0,
            dateFrom: Utils.convertToUTC(auditDate[0]),
            dateTo: Utils.convertToUTC(auditDate[1])
        }
        fetchDataAuditDate(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[hotelId])

    useEffect(() => {
        const data: IRunNightAudit = {
            hotelGuid: hotelId,
            type: DateTypeStatus.ByDate,
            dateFrom: Utils.convertToUTC(changeDateTime[0]),
            dateTo: Utils.convertToUTC(changeDateTime[1])
        }
        fetchDataAuditDate(data)
    },[changeDateTime])

    const fetchDataAuditDate = async (data: IRunNightAudit) => {
        const auditDate = await PrintReportService.getAuditDate(data)
        if(auditDate) {
            if(auditDate.tuNgay){
                setAuditDate([new Date(auditDate.tuNgay), new Date(auditDate.denNgay)])
                setValue("time", [new Date(auditDate.tuNgay), new Date(auditDate.denNgay)])
            }
        } 
    }
    
    const handleChangeTypeDate = (dateSchedule: Date[], type: number) => {
        const data: IRunNightAudit = {
            hotelGuid: hotelId,
            type: type,
            dateFrom: Utils.convertToUTC(dateSchedule[0]),
            dateTo: Utils.convertToUTC(dateSchedule[1])
        }
        fetchDataAuditDate(data)
        
    }
    const onCancel = () => {
        setIsShowModal(false)
    }

    const handleOk = handleSubmit(async (data: IAccountDetailReport) => {
        onSubmitAccountDetail(data)
    })

    //select rows account
    const handleSelectAccount = (selectedRows: ITableFixCharge[],keys:React.Key[]) => {
        const select: React.SetStateAction<string[]> = []
        selectedRows.forEach((item: ITableFixCharge) => item.ma && select.push(item.ma.toString()))
        select.length > 0 ? setValue("allAccount", false) : setValue("allAccount", true);
        setSelectedRowsArray(keys)
        setSelectAccount(select)
    }

    return (
        <CModel
            visible={isShowModal}
            title={title}
            onCancel={onCancel}
            isLoading={isLoading}
            width={"50%"}
            style={{top: "0%"}}
            onOk={() => handleOk()}
            content={
                <>
                    <form id="formCashierReport" onSubmit={handleOk} className="custom-scrollbar-pkm">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-10">
                                <label className={"font-semibold"}>{t("REPORT.duarationTime")}</label>
                                <Controller
                                    name="date"
                                    defaultValue={[new Date(), new Date()]}
                                    control={control} render={({ onChange, value }) => (
                                        <div className="flex items-center">
                                            <RangePicker
                                                value={value}
                                                onClick={() => { onChange({ ...value, isOpen: true })}}
                                                className={`${classes.datePicker} w-full`}
                                                disabled={isDisableDate}
                                                format="YYYY-MM-DD"
                                                placeholder={['Start Time', 'End Time']}
                                                onChange={(date) => {
                                                    onChange(date)
                                                    if(date && date[0] && date[1]){
                                                        setChangeDateTime([date[0], date[1]])
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div className={`col-span-12 `}>
                                <Controller render={(
                                    { onChange }) => (
                                    <Radio.Group
                                        className={`font-semibold text-base`}
                                        onChange={e => {
                                            onChange(e.target.value);
                                            e.target.value === DateTypeStatus.ByDate ? setIsDisableDate(false) : setIsDisableDate(true)
                                            if(e.target.value === DateTypeStatus.Today){
                                                handleChangeTypeDate([new Date(), new Date], DateTypeStatus.Today)
                                                setValue("date", [new Date(),new Date()])
                                            }else if(e.target.value === DateTypeStatus.Yesterday) {
                                                setValue("date", [subDays(new Date(), 1), subDays(new Date(), 1)])
                                                handleChangeTypeDate([subDays(new Date(), 1), subDays(new Date(), 1)], DateTypeStatus.Yesterday)
                                            }else if(e.target.value === DateTypeStatus.Tomorow){
                                                setValue("date", [addDays(new Date(), 1), addDays(new Date(), 1)])
                                                setAuditDate([addDays(new Date(), 1), addDays(new Date(), 1)])
                                            } 
                                        }}
                                        defaultValue={DateTypeStatus.Today}
                                    >
                                        <Radio value={DateTypeStatus.Today}>{t("REPORT.today")}</Radio>
                                        <Radio value={DateTypeStatus.Yesterday}>{t("REPORT.yesterday")}</Radio>
                                        <Radio value={DateTypeStatus.ByDate}>{t("REPORT.byDate")}</Radio>
                                        <Radio value={DateTypeStatus.Tomorow}>{t("REPORT.tomorrow")}</Radio>
                                    </Radio.Group>
                                )}
                                name="dateType" defaultValue={DateTypeStatus.Today} control={control} />
                                <Divider dashed style={{margin: "6px 0"}}/>
                            </div>
                            <div className="col-span-12">
                                <Controller
                                    control={control}
                                    defaultValue={false}
                                    name="isTypeTime"
                                    render={({ onChange }) => (
                                        <Checkbox
                                            className={`font-semibold text-base`}
                                            defaultChecked={false}
                                            onChange={(e) => {
                                                onChange(e.target.checked)
                                                setIsCheck(e.target.checked)
                                            }}
                                        >
                                            {t("REPORT.typeDateAndTime")}
                                        </Checkbox>
                                    )}
                                />
                            </div>
                            <div className="col-span-10">
                                <label className={"font-semibold"}>{t("REPORT.duarationTime")}</label>
                                <Controller
                                    name="time"
                                    defaultValue={[auditDate[0], auditDate[1]]}
                                    control={control} render={({ onChange, value }) => (
                                        <div className="flex items-center">
                                            <RangePicker
                                                value={value}
                                                onClick={() => { onChange({ ...value, isOpen: true })}}
                                                className={`${classes.datePicker} w-full`}
                                                showTime={{hideDisabledOptions: true}}
                                                disabled={!isCheck}
                                                format="YYYY-MM-DD HH:mm"
                                                placeholder={['Start Time', 'End Time']}
                                                onChange={(date) => onChange(date)}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <Divider dashed style={{margin: "6px 0"}}/>
                            <div className="col-span-12">
                                <label className="m-0 font-semibold text-xl leading-5">
                                    {t("REPORT.accountName")}
                                </label>
                                <Controller render={(
                                    { onChange, onBlur, value, name, ref }) => (
                                    <Checkbox
                                        className={`${classes.titleCheckbox} flex-row items-center font-semibold float-right`}
                                        defaultChecked={true}
                                        checked={value}
                                        onChange={(e) => {
                                            onChange(e.target.checked)
                                            setSelectedRowsArray([])
                                        }}>
                                        {t("REPORT.allAccount")}
                                    </Checkbox>
                                )}
                                name="allAccount" defaultValue={true} control={control} />
                            </div>
                            <div className="col-span-12">
                                <TableAccountReport
                                    height={525}
                                    dataTable={dataTable}
                                    handleSelect={handleSelectAccount}
                                    selectedRowsArray={selectedRowsArray}
                                    // setPageNumber={setPageNumber}
                                    // setPageSize={setPageSize}
                                />
                            </div>
                        </div>
                    </form>
                </>
            }
        />
    );
}
