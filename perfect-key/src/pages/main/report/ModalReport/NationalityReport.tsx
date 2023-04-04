import { Input, Radio, Select } from 'antd';
import { OrderByCompanyOption, Quarter, TypeMonthly } from 'common/enum/report.enum';
import { IDataNationalityReport } from 'common/report/define-report';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import { addDays } from 'date-fns';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStyleTheme } from 'theme';

interface PropsNationalityReportModal {
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    isLoading: boolean,
    onSubmit(data: IDataNationalityReport): Promise<void>,
    monthType: string
}
const { Option } = Select;
const { RangePicker } = DatePicker;
export const NationalityReportModal = ({setIsShowModal, isShowModal, title, isLoading,
    onSubmit, monthType} : PropsNationalityReportModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { control, handleSubmit, setValue, getValues } = useForm();

    const [isOpen, setIsOpen] = useState(false);
    const [currentYear, setCurrentYear] = useState<Date>(new Date());
    // const [pageSize, setPageSize] = useState<number>(CashierService.getPageSizeMove(size));
    // const [pageNumber, setPageNumber] = useState<number>(1);
    const monthly = ["","Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", 
        "Month 7", "Month 8", "Month 9", "Month 10", "Month 11", "Month 12"];

    const onCancel = () => {
        setIsShowModal(false)
    }

    const handleOk = handleSubmit(async (data: IDataNationalityReport) => {
        onSubmit(data)
    })

    return (
        <CModel
            visible={isShowModal}
            title={title}
            onCancel={onCancel}
            width={"55%"}
            isLoading={isLoading}
            onOk={() => handleOk()}
            content={
                <>
                    <form id="formCashierReport" onSubmit={handleOk} className="custom-scrollbar-pkm">
                        <div className="grid grid-cols-12 gap-4">
                            <div className={monthType !== TypeMonthly.Monthly ? "col-span-3" : "col-span-6"}>
                                <label className={"font-semibold"}>{t("REPORT.duarationTime")}</label>
                                <Controller
                                    name="year"
                                    defaultValue={new Date()}
                                    control={control} render={({ onChange, value }) => (
                                        <div className="flex items-center">
                                            <DatePicker
                                                value={value} open={isOpen} mode="year"
                                                className={`${classes.datePicker} w-full`}
                                                placeholder="Select Year"
                                                defaultValue={new Date()}
                                                format="YYYY"
                                                onOpenChange={status => status ? setIsOpen(true) : setIsOpen(false)}
                                                onPanelChange={(date: Date) => {
                                                    onChange(date)
                                                    setValue("date", [new Date(date.getFullYear(), 0, 1), addDays(new Date(date.getFullYear(), 0, 1), 30)])
                                                    setValue("month", monthly[0])
                                                    setCurrentYear(date)
                                                }}
                                                onChange={(date) => onChange(date)}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            {monthType !== TypeMonthly.Monthly ? <div className={`col-span-9 pt-8`}>
                                <Controller render={(
                                    { onChange }) => (
                                    <Radio.Group
                                        className={`font-semibold text-base mt-4`}
                                        onChange={e => { 
                                            onChange(e.target.value); 
                                            const year = getValues("year")
                                            if(e.target.value === Quarter.I){
                                                setValue("date", [new Date(year.getFullYear(), 0 , 1), new Date(year.getFullYear(), 3, 0)])
                                            }else if(e.target.value === Quarter.II){
                                                setValue("date", [new Date(year.getFullYear(), 3 , 1), new Date(year.getFullYear(), 6, 0)])
                                            }else if(e.target.value === Quarter.III){
                                                setValue("date", [new Date(year.getFullYear(), 6 , 1), new Date(year.getFullYear(), 9, 0)])
                                            }else{
                                                setValue("date", [new Date(year.getFullYear(), 9 , 1), new Date(year.getFullYear(), 12, 0)])
                                            }
                                        }}
                                        defaultValue={Quarter.I}
                                    >
                                        <Radio value={Quarter.I}>{t("REPORT.quarterI")}</Radio>
                                        <Radio value={Quarter.II}>{t("REPORT.quarterII")}</Radio>
                                        <Radio value={Quarter.III}>{t("REPORT.quarterIII")}</Radio>
                                        <Radio value={Quarter.IV}>{t("REPORT.quarterIV")}</Radio>
                                    </Radio.Group>
                                )}
                                name="quater" defaultValue={Quarter.I} control={control} />
                            </div> :
                                <div className={monthType !== TypeMonthly.Monthly ? "col-span-4" : "col-span-6"}>
                                    <label className="m-0 font-base font-bold">
                                        {t("REPORT.month")}
                                    </label>
                                    <Controller
                                        render={({ onChange, value, ref }) =>
                                            <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                                showSearch
                                                value={value}
                                                defaultValue={monthly[1]}
                                                onChange={(e) => {
                                                    onChange(e)
                                                    const year = getValues("year")
                                                    const month = Number.parseInt(e.substring(e.indexOf(" ")))
                                                    setValue("date", [new Date(year.getFullYear(), month - 1 , 1), new Date(year.getFullYear(), month, 0)])
                                                }}
                                            >
                                                {monthly.map((item, index) => {
                                                    return (
                                                        <Option value={item} key={index}>{item}</Option>
                                                    )
                                                })
                                                }
                                            </Select>
                                        }
                                        name="month" control={control} defaultValue={monthly[1]}/>
                                </div>
                            }
                            <div className={monthType !== TypeMonthly.Monthly ? "col-span-8" : "col-span-12"}>
                                <label className={"font-semibold"}>{t("REPORT.from")}</label>
                                <label className={"font-semibold"} style={{marginLeft: "40%"}}>{t("REPORT.to")}</label>
                                <Controller
                                    name="date"
                                    defaultValue={monthType !== TypeMonthly.Monthly ? [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 3, 0)] : [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 1, 0)]}
                                    control={control} render={({ onChange, value }) => (
                                        <div className="flex items-center">
                                            <RangePicker
                                                value={value}
                                                onClick={() => { onChange({ ...value, isOpen: true })}}
                                                defaultValue={[new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 3, 0)]}
                                                className={`${classes.datePicker} w-full`}
                                                disabled
                                                disabledDate={(date) => date && date < new Date(currentYear.getFullYear(), getValues("month"), 1) && date > new Date(getValues("year").getFullYear(),  getValues("month") -1, 0)}
                                                format="YYYY-MM-DD"
                                                placeholder={['Start Time', 'End Time']}
                                                onChange={(date) => onChange(date)}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            {monthType !== TypeMonthly.Monthly ? <div className="col-span-4">
                                <label className="m-0 font-base font-bold">
                                    {t("REPORT.month")}
                                </label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                            showSearch
                                            value={value}
                                            defaultValue={monthly[0]}
                                            onChange={(e) => {
                                                onChange(e)
                                                const year = getValues("year")
                                                const month = Number.parseInt(e.substring(e.indexOf(" ")))
                                                setValue("date", [new Date(year.getFullYear(), month - 1 , 1), new Date(year.getFullYear(), month, 0)])
                                            }}
                                        >
                                            {monthly.map((item, index) => {
                                                return (
                                                    <Option value={item} key={index}>{item}</Option>
                                                )
                                            })
                                            }
                                        </Select>
                                    }
                                    name="month" control={control} defaultValue={monthly[0]}/>
                            </div> : ""
                            }
                            <fieldset style={{border: "1px black solid"}} className="col-span-12 grid grid-cols-12 gap-4 px-2 pb-4">
                                <legend style={{width: "15%", marginLeft: "2em", padding: "0 0.8em", fontSize: "14px"}}>Order By</legend>
                                <div className="col-span-4 mr-2">
                                    <label className="m-0 font-base font-bold">
                                        {t("REPORT.inputNumberToView")}
                                    </label>
                                    <Controller
                                        render={({ onChange, value, ref }) =>
                                            <Input
                                                className={`${classes.input}`}
                                                defaultValue={0}
                                                type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                value={value} onChange={(e) => { onChange(e.target.value) }} >
                                            </Input>}
                                        name="numberView" control={control} defaultValue={0} />
                                </div>
                                <div className="col-span-8 pt-8" >
                                    <Controller render={(
                                        { onChange }) => (
                                        <Radio.Group
                                            className={`font-semibold text-base mt-4`}
                                            onChange={e => { 
                                                onChange(e.target.value); 
                                            }}
                                            defaultValue={OrderByCompanyOption.TopByRoomNight}
                                        >
                                            <Radio value={OrderByCompanyOption.TopByRoomNight} style={{marginRight: 0}}>{t("REPORT.OrderRoomNight")}</Radio>
                                            <Radio value={OrderByCompanyOption.TopByRevenue}>{t("REPORT.OrderRoomRevenue")}</Radio>
                                        </Radio.Group>
                                    )}
                                    name="orderBy" defaultValue={OrderByCompanyOption.TopByRoomNight} control={control} />
                                </div>
                            </fieldset>
                        </div>
                    </form>
                </>
            }
        />
    );
}
