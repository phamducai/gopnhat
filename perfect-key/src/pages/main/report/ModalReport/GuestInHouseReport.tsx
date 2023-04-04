import { Input } from 'antd';
import { GuestInHouseOption, RateOption } from 'common/enum/report.enum';
import { IGuestInHouseReport } from 'common/report/define-report';
import CModel from 'components/CModal';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStyleTheme } from 'theme';

interface PropsGuestInHouseReportModal {
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    onSubmit(data: IGuestInHouseReport, guestInHouseOption: number, rateOption: number): Promise<void>,
    isLoadingPrint: boolean
}
export const GuestInHouseReportModal = ({setIsShowModal, isShowModal, title, onSubmit, isLoadingPrint} : PropsGuestInHouseReportModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { control, handleSubmit } = useForm();

    const onCancel = () => {
        setIsShowModal(false)
    }

    const handleOk = handleSubmit(async (data: IGuestInHouseReport) => {
        onSubmit(data, GuestInHouseOption.orderBy, RateOption.NoRate)
    })

    return (
        <CModel
            visible={isShowModal}
            isLoading={isLoadingPrint}
            title={title}
            onCancel={onCancel}
            onOk={handleOk}
            content={
                <>
                    <form id="formCashierReport" onSubmit={handleOk} className="custom-scrollbar-pkm">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 mr-2">
                                <label className="m-0 font-base font-bold">
                                    {t("REPORT.inputGroupCode")}
                                </label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            className={`${classes.input}`}
                                            defaultValue={0}
                                            type="text" style={{ background: "#F5F6F7", height: 40 }}
                                            value={value} onChange={(e) => { onChange(e.target.value) }} >
                                        </Input>}
                                    name="groupCode" control={control} defaultValue={""} />
                            </div>
                            {/* <fieldset style={{border: "1px black solid"}} className="col-span-12 grid grid-cols-12 gap-4 px-2 pb-4">
                                <legend style={{width: "20%", marginLeft: "2em", padding: "0 0.8em", fontSize: "14px"}}>Sort Type</legend>
                                <div className="col-span-12 flex justify-around" >
                                    <Controller render={(
                                        { onChange }) => (
                                        <Radio.Group
                                            className={`font-semibold text-base mt-4`}
                                            onChange={e => { onChange(e.target.value); }}
                                            defaultValue={ReservationStatus.CheckIn}
                                        >
                                            <Radio value={ReservationStatus.CheckIn}>Sort by Guest Name</Radio>
                                            <Radio value={ReservationStatus.WaitingList}>Sort by Room</Radio>
                                        </Radio.Group>
                                    )}
                                    name="searchBy" defaultValue={0} control={control} />
                                </div>
                            </fieldset> */}
                        </div>
                    </form>
                </>
            }
        />
    );
}
