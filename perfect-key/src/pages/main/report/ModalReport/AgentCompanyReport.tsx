import { Select } from 'antd';
import { ICompanyAgentReport } from 'common/report/define-report';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { companyProfilesFilterByInputRequest } from 'redux/controller/reservation.slice';
import { useSelectorRoot } from 'redux/store';
import { useStyleTheme } from 'theme';
const { Option } = Select;

interface PropsAgentCompanyReportModal {
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    isChooseDate: boolean,
    onSubmit(data: ICompanyAgentReport): Promise<void>,
    isLoading: boolean
}
export const AgentCompanyReportModal = ({setIsShowModal, isShowModal, title, isChooseDate, onSubmit, isLoading} : PropsAgentCompanyReportModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { control, handleSubmit } = useForm();
    const { t } = useTranslation("translation");
    const { filteredCompanyProfile } = useSelectorRoot(state => state.rsvn);
    const { hotelId } = useSelectorRoot(state => state.app);
    const dispatch = useDispatch()

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (filteredCompanyProfile.length === 0) {
            dispatch(companyProfilesFilterByInputRequest({
                hotelGuid: hotelId,
                input: 'g'
            }))
        }
    }, [dispatch, filteredCompanyProfile.length, hotelId])
    
    const onCancel = () => {
        setIsShowModal(false)
    }

    const handleOk = handleSubmit(async (data: ICompanyAgentReport) => {
        onSubmit(data)
    })

    return (
        <CModel
            visible={isShowModal}
            title={title}
            onCancel={onCancel}
            isLoading={isLoading}
            onOk={() => handleOk()}
            content={
                <>
                    <form id="formCashierReport" onSubmit={handleOk} >
                        <div className="grid grid-cols-12 gap-4">
                            {isChooseDate && <div className="col-span-12">
                                <label className={"font-semibold"}>{t("REPORT.year")}</label>
                                <Controller
                                    name="date"
                                    defaultValue={new Date()}
                                    control={control} render={({ onChange, value }) => (
                                        <div className="flex items-center">
                                            <DatePicker
                                                value={value} open={isOpen} mode="year"
                                                className={`${classes.datePicker}`}
                                                placeholder="Select Year"
                                                defaultValue={new Date()}
                                                format={Utils.typeFormatYear()}
                                                disabledDate={(date: Date) => date > new Date() }
                                                onOpenChange={status => status ? setIsOpen(true) : setIsOpen(false)}
                                                onPanelChange={(date: Date) => {
                                                    setIsOpen(false);
                                                    onChange(date)
                                                }}
                                                onChange={(date) => onChange(date)}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            }
                            <div className="col-span-12">
                                <label className="m-0 font-base font-bold">
                                    {t("REPORT.agentCompany")}
                                </label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Select className={`${classes.selectBackground} w-full !rounded-md`}
                                            showSearch
                                            value={value}
                                            defaultValue={''}
                                            onChange={(e) => {onChange(e)}}
                                        >
                                            <Option key={0} value={""}>{""}</Option>
                                            {filteredCompanyProfile ? filteredCompanyProfile.map((item) => {
                                                return (
                                                    <Option value={item.guid} key={item.id}>{item.ten}</Option>
                                                )
                                            }) : ""
                                            }
                                        </Select>
                                    }
                                    name="companyAgent" control={control} defaultValue={''}/>
                            </div>
                        </div>
                    </form>
                </>
            }
        />
    );
}
