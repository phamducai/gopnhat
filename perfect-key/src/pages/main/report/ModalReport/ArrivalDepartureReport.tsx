import Checkbox from 'antd/lib/checkbox/Checkbox';
import TextArea from 'antd/lib/input/TextArea';
import { IInputDataReport } from 'common/report/define-report';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStyleTheme } from 'theme';

interface PropsArrivalDepartureReportModal {
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    typeModal: string,
    onSubmitArrival(data: IInputDataReport): Promise<void>,
    isGroupCode: boolean,
    isLoading: boolean
}
export const ArrivalDepartureReportModal = ({setIsShowModal, isShowModal, title, typeModal, onSubmitArrival, 
    isGroupCode, isLoading} : PropsArrivalDepartureReportModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { control, handleSubmit } = useForm();

    const onCancel = () => {
        setIsShowModal(false)
    }

    const handleOk = handleSubmit(async (data: IInputDataReport) => {
        onSubmitArrival(data)
    })

    return (
        <CModel
            visible={isShowModal}
            title={title}
            onCancel={onCancel}
            // width={"50%"}
            onOk={handleOk}
            isLoading={isLoading}
            content={
                <>
                    <form id="formCashierReport" onSubmit={handleOk} >
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-4">
                                <label className={"font-semibold"}>{typeModal}:</label>
                                <Controller
                                    name="date"
                                    defaultValue={new Date()}
                                    control={control} render={({ onChange, value }) => (
                                        <div className="flex items-center">
                                            <DatePicker
                                                defaultValue={new Date()}
                                                className={`${classes.datePicker} `}
                                                format={Utils.typeFormatDate()}
                                                onChange={(date) => onChange(date)}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="col-span-4 pt-7">
                                <Controller render={(
                                    { onChange}) => (
                                    <Checkbox
                                        className={`${classes.titleCheckbox} flex-row items-center font-semibold `}
                                        defaultChecked={false}
                                        onChange={(e) => {
                                            onChange(e.target.checked)
                                        }}>
                                        {t("REPORT.groupCode")}
                                    </Checkbox>
                                )}
                                name="mainGuest" defaultValue={false} control={control} />
                            </div>
                            <div className="col-span-4 pt-7">
                                <Controller render={(
                                    { onChange, onBlur, value, name, ref }) => (
                                    <Checkbox
                                        className={`${classes.titleCheckbox} flex-row items-center font-semibold `}
                                        defaultChecked={false}
                                        onChange={(e) => {
                                            onChange(e.target.checked)
                                        }}>
                                        {t("REPORT.withComment")}
                                    </Checkbox>
                                )}
                                name="isComments" defaultValue={false} control={control} />
                            </div>
                            {isGroupCode ? 
                                <div className="col-span-12 pb-3">
                                    <label className="m-0 font-base font-bold">
                                        {t("REPORT.groupCode")}
                                    </label>
                                    <Controller render={({ onChange, value, ref }) =>
                                        <TextArea className={`${classes.textArea} w-full col-span-12`} 
                                            style={{ height: 60, backgroundColor: "#F5F6F7", borderRadius: 6 }} 
                                            placeholder="Input here" 
                                            onChange={(e) => onChange(e.target.value) }
                                        />
                                    }
                                    name="groupCode" defaultValue="" control={control}
                                    />
                                </div>
                                : 
                                <div className="col-span-12 pb-3">
                                    <label className="m-0 font-base font-bold">
                                        {t("REPORT.lastName")}
                                    </label>
                                    <Controller render={({ onChange, value, ref }) =>
                                        <TextArea className={`${classes.textArea} w-full col-span-12`} 
                                            style={{ height: 60, backgroundColor: "#F5F6F7", borderRadius: 6 }} 
                                            placeholder="Input here" 
                                            onChange={(e) => onChange(e.target.value) }
                                        />
                                    }
                                    name="lastName" defaultValue="" control={control}
                                    />
                                </div>
                            }
                        </div>
                    </form>
                </>
            }
        />
    );
}
