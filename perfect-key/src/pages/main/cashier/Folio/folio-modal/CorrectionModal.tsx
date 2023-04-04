import { Button, Input, InputNumber, Modal } from 'antd';
import { ITableFolio } from 'common/cashier/model-cashier';
import { IParam, IPostingCorrection } from 'common/cashier/model-folio';
import { NotificationStatus } from 'common/enum/shared.enum';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CIconSvg from 'components/CIconSvg';
import openNotification from 'components/CNotification';
import TextArea from 'rc-textarea';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useSelectorRoot } from 'redux/store';
import FolioService from 'services/cashier/folio.service';
import { useStyleTheme } from 'theme';
import { styleCorrection } from './styles/stylesCorrection';

interface PropsCorrectionModal {
    isCorrectionModal: boolean;
    setIsCorrectionModal: React.Dispatch<React.SetStateAction<boolean>>,
    selectedRowsFolio: ITableFolio[],
    groupGuidId: string,
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    fetchGroup(tsRomGuid: string): void
}
export const CorrectionModal = ({
    isCorrectionModal, setIsCorrectionModal, selectedRowsFolio, groupGuidId,
    getDataFolio, getListGroupFolio, fetchGroup }: PropsCorrectionModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { handleSubmit, control } = useForm();
    const { businessDate } = useSelectorRoot(state => state.hotelConfig)
    const params: IParam = useParams();

    const onCancel = () => {
        setIsCorrectionModal(false)
    }

    const onOk = handleSubmit(async (data: IPostingCorrection) => {
        const ngayThang = Utils.formatDate(new Date(data.ngayThang))
        const business = Utils.formatDate(new Date(businessDate))
        const tinhChat = selectedRowsFolio[0].thanhTien !== "0" ? "D" : "C";
        if (ngayThang === business) {
            await FolioService.postingCorrection(data, selectedRowsFolio[0].guid, tinhChat);
            getDataFolio(groupGuidId);
            getListGroupFolio(params.tsRoomGuid);
            fetchGroup(params.tsRoomGuid);
            setIsCorrectionModal(false)
        } else {
            openNotification(NotificationStatus.Error, "", "Date's folio invaild business Date");
        }
    })

    return (
        <Modal
            title={<span className={`${classes.titleStyle}`}>{t("CASHIER.FOLIO.correction")}</span>}
            visible={isCorrectionModal}
            destroyOnClose={true}
            className={classes.antModalStyle}
            closeIcon={<CIconSvg name="close-drawer" hexColor="#F74352" svgSize="default" onClick={() => onCancel()} />}
            footer={
                <div className="flex justify-between m-auto w-full">
                    <div className="footer-left"></div>
                    <div className="footer-right">
                        <Button
                            style={{ color: "#F74352", border: "1px solid #F74352" }}
                            className={`!rounded-md ${classes.buttonStyle}`}
                            onClick={() => onCancel()}
                        >
                            {t("BOOKING.RESERVATION.EDITRESERVATION.close")}
                        </Button >
                        <Button
                            // form={myForm}
                            type="primary" htmlType="button"
                            className={`!rounded-md ${classes.buttonStyle}`}
                            // loading={isLoading}
                            // disabled={disableBtn}
                            onClick={onOk}
                        >
                            {t("BOOKING.RESERVATION.ok")}
                        </Button>
                    </div>
                </div >
            }
        >
            <form onSubmit={onOk} id="form-correction">
                <div className="grid grid-cols-12 gap-4">
                    <div className="xl:col-span-6 col-span-12">
                        <label className="m-0 font-base font-bold">
                            {t("BOOKING.date")}:
                        </label>
                        <Controller
                            name="ngayThang"
                            render={({ onChange, value }) =>
                                <DatePicker
                                    onChange={(date) => {
                                        onChange(date)
                                    }}
                                    defaultValue={new Date()}
                                    value={value}
                                    className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                    name="ngayThang"
                                    disabled
                                />}
                            control={control} defaultValue={new Date()} />
                    </div>
                    <div className="xl:col-span-6 col-span-6">
                        <label className="m-0 font-base font-bold">
                            {t("CASHIER.FOLIO.value")}:
                        </label>
                        <Controller
                            render={({ onChange, value, ref }) =>
                                <InputNumber
                                    min={0} disabled value={value}
                                    className={`${classes.inputNumber} hiden-handler-wrap`}
                                    style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                                    formatter={e => `${Utils.formatNumber(e)}`}
                                    onChange={(e) => {
                                        onChange(e)
                                    }}>
                                </InputNumber>}
                                
                            name="thanhTien" control={control} defaultValue={selectedRowsFolio[0].thanhTien !== "0" ? selectedRowsFolio[0]?.thanhTien : selectedRowsFolio[0]?.thanhTien1} />
                    </div>
                    <div className="col-span-12">
                        <label className="m-0 font-base font-bold">
                            {t("CASHIER.FOLIO.reason")}:
                        </label>
                        <Controller
                            render={({ onChange, value, ref }) =>
                                <Input
                                    className={`${classes.input}`}
                                    type="text" style={{ background: "#F5F6F7", height: 40 }}
                                    value={value}
                                    onChange={(e) => {
                                        onChange(e.target.value)
                                    }} >
                                </Input>}
                            name="suplement" control={control} defaultValue={""} />
                    </div>
                    <div className="col-span-12">
                        <label className="m-0 font-base font-bold">
                            {t("CASHIER.FOLIO.description")}:
                        </label>
                        <Controller render={({ onChange, value, ref }) =>
                            <TextArea className={`${classes.textArea} w-full col-span-12`}
                                style={{ height: 100, backgroundColor: "#F5F6F7", borderRadius: 6 }}
                                placeholder="Input comment here" disabled
                                defaultValue={selectedRowsFolio[0]?.dienGiai}
                                onChange={(e) => onChange(e.target.value)}
                            />
                        }
                        name="description" defaultValue={selectedRowsFolio[0]?.dienGiai} control={control}
                        />
                    </div>
                </div>
            </form>
        </Modal >
    );
}
