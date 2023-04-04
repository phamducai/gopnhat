import { Radio } from 'antd';
import { IRunNightAudit } from 'common/end-of-day/model-runNight';
import { DateTypeStatus } from 'common/enum/report.enum';
import { IDataDateFromReport } from 'common/report/define-report';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import { subDays } from 'date-fns';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelectorRoot } from 'redux/store';
import PrintReportService from 'services/report/printReport.service';
import { useStyleTheme } from 'theme';

interface PropsEODReportModal {
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    onSubmit(data: IDataDateFromReport): Promise<void>,
    isLoadingPrint?: boolean
}
const { RangePicker } = DatePicker;
export const EODReportModal = ({ setIsShowModal, isShowModal, title, onSubmit, isLoadingPrint }: PropsEODReportModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { hotelId } = useSelectorRoot(state => state.app)
    const { businessDate } = useSelectorRoot(state => state.hotelConfig)
    const { handleSubmit, control, setValue } = useForm();

    const [auditDate, setAuditDate] = useState<Date[]>([new Date(), new Date()])
    const [isDisableDate, setIsDisableDate] = useState(true)

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

    const onCancel = () => {
        setIsShowModal(false)
    }

    const onOk = handleSubmit(async (data: IDataDateFromReport) => {
        onSubmit(data)
    })

    const fetchDataAuditDate = async (data: IRunNightAudit) => {
        const auditDate = await PrintReportService.getAuditDate(data)
        if(auditDate) {
            setAuditDate([new Date(auditDate.tuNgay), new Date(auditDate.denNgay)])
            setValue("dateSchedule", [new Date(auditDate.tuNgay), new Date(auditDate.denNgay)])
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
    return (
        <CModel
            visible={isShowModal}
            title={title}
            onCancel={onCancel}
            isLoading={isLoadingPrint}            
            onOk={onOk}
            content={
                <>
                    <form id="formCashierReport" onSubmit={onOk} >
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12">
                                <label className={"font-semibold"}>{t("REPORT.from")}</label>
                                <label className={"font-semibold"} style={{ marginLeft: "43%" }}>{t("REPORT.to")}</label>
                                <Controller
                                    name="dateSchedule"
                                    control={control} render={({ onChange, value }) => (
                                        <div className="flex items-center">
                                            <RangePicker
                                                value={value}
                                                onClick={() => { onChange({ ...value, isOpen: true })}}
                                                defaultValue={[new Date(), new Date()]}
                                                className={`${classes.datePicker} w-full`}
                                                disabled={isDisableDate}
                                                disabledDate={date => date > businessDate}
                                                format="YYYY-MM-DD"
                                                placeholder={['Start Time', 'End Time']}
                                                onChange={(date) => onChange(date)}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div className={`col-span-12 `}>
                                <Controller render={(
                                    { onChange }) => (
                                    <Radio.Group
                                        className={`font-semibold text-base mt-4`}
                                        onChange={e => {
                                            onChange(e.target.value);
                                            e.target.value === DateTypeStatus.ByDate ? setIsDisableDate(false) : setIsDisableDate(true)
                                            if(e.target.value === DateTypeStatus.Yesterday) {
                                                setValue("dateSchedule", [subDays(new Date(), 1), subDays(new Date(), 1)])
                                                handleChangeTypeDate([subDays(new Date(), 1), subDays(new Date(), 1)], DateTypeStatus.Yesterday)
                                            }
                                        }}
                                        defaultValue={DateTypeStatus.Yesterday}
                                    >
                                        <Radio value={DateTypeStatus.Yesterday}>{t("REPORT.yesterday")}</Radio>
                                        <Radio value={DateTypeStatus.ByDate}>{t("REPORT.byDate")}</Radio>
                                    </Radio.Group>
                                )}
                                name="dateType" defaultValue={DateTypeStatus.Today} control={control} />
                            </div>
                        </div>
                    </form>
                </>
            }
        />
    );
}
