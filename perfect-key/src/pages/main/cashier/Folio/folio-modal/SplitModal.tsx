import { Input, InputNumber } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { IGetDataFolio, ITableFolio } from 'common/cashier/model-cashier';
import { IParam, ISplitFolio } from 'common/cashier/model-folio';
import { TypeActionCode } from 'common/enum/tracer.enum';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { setTraceFolioRequest } from 'redux/controller/trace.slice';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import FolioService from 'services/cashier/folio.service';
import { useStyleTheme } from 'theme';
import { styleCorrection } from './styles/stylesCorrection';

interface PropsCorrectionModal {
    isSplitModal: boolean;
    setIsSplitModal: React.Dispatch<React.SetStateAction<boolean>>,
    selectedRowsFolio: ITableFolio[],
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    groupGuidId: string,
    fetchGroup(tsRomGuid: string): void,
    indexGroupFolio: number
}
export const SplitModal = ({
    isSplitModal, setIsSplitModal, selectedRowsFolio, getDataFolio, groupGuidId,
    getListGroupFolio, fetchGroup, indexGroupFolio }: PropsCorrectionModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const params: IParam = useParams();
    const { t } = useTranslation("translation");
    const { handleSubmit, control, setValue } = useForm();
    
    const { hotelId } = useSelectorRoot(x => x.app);
    const dispatch = useDispatchRoot();

    const [dataFolio, setDataFolio] = useState<IGetDataFolio | null>(null)

    useEffect(() => {
        const getFolio = async () => {
            const getData = await FolioService.getDataFolio(selectedRowsFolio[0].guid);
            getData && setDataFolio(getData)
        }
        getFolio()
    }, [selectedRowsFolio])

    const onCancel = () => {
        setIsSplitModal(false)
    }

    const onOk = handleSubmit(async (data: ISplitFolio) => {
        const value = Utils.unsetFormatNumber(selectedRowsFolio[0]?.thanhTien.toString())
        dataFolio && await FolioService.postingSplit(dataFolio, data, selectedRowsFolio[0]?.dienGiai, value);
        traceFolio(selectedRowsFolio[0].id, selectedRowsFolio[0]?.dienGiai, (data.thanhTien !== 0 ? 1 : data.pieces));
        getDataFolio(groupGuidId);
        getListGroupFolio(params.tsRoomGuid);
        fetchGroup(params.tsRoomGuid);
        setIsSplitModal(false)
    })

    const traceFolio =(id: number, dienGiai: string, pieces: number)=> {
        dispatch(setTraceFolioRequest({
            actionCode: TypeActionCode.FolioSplit,
            objectGuid: params.tsRoomGuid,
            oldString: `In Folio ${indexGroupFolio} - FolioId ${id} - Split ${dienGiai}`,
            newString: `In Folio ${indexGroupFolio} - Split ${pieces} pieces`,
            oldDate: new Date(),
            newDate: new Date(),
            hotelGuid: hotelId,
            parentGuid: groupGuidId
        }));
    }

    return (
        <CModel
            visible={isSplitModal}
            title={`Split Folio - ${selectedRowsFolio[0]?.dienGiai}: ${selectedRowsFolio[0]?.thanhTien}`}
            onOk={() => onOk()}
            onCancel={onCancel}
            width={"35%"}
            content={
                <form onSubmit={onOk} id="form-split">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-5">
                            <label className="m-0 font-base font-bold">{t("BOOKING.date")}:</label>
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
                        <div className="col-span-5">
                            <label className="m-0 font-base font-bold">{t("CASHIER.FOLIO.value")}:</label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <InputNumber
                                        min={0}
                                        className={`${classes.inputNumber} hiden-handler-wrap`}
                                        style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                                        value={value}
                                        formatter={e => `${Utils.formatNumber(e)}`}
                                        onChange={(e) => {
                                            e < Utils.parseLocaleNumber(selectedRowsFolio[0]?.thanhTien.toString()) ? 
                                                onChange(e) : 
                                                onChange(Utils.parseLocaleNumber(selectedRowsFolio[0]?.thanhTien.toString()))
                                            setValue("pieces", 0)
                                        }}>
                                    </InputNumber>
                                }
                                name="thanhTien" control={control} defaultValue={0} />
                        </div>
                        <div className="col-span-2">
                            <label className="m-0 font-base font-bold">{t("CASHIER.FOLIO.pieces")}:</label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <Input
                                        min={0}
                                        className={`${classes.input}`}
                                        placeholder={"0"}
                                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                                        value={value}
                                        onChange={(e) => {
                                            onChange(Number.parseInt(e.target.value))
                                            setValue("thanhTien", 0)
                                        }} >
                                    </Input>}
                                name="pieces" control={control} defaultValue={0} />
                        </div>
                        <div className="col-span-12">
                            <label className="m-0 font-base font-bold">{t("CASHIER.FOLIO.reason")}</label>
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
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <TextArea className={`${classes.textArea} w-full col-span-12`}
                                        style={{ height: 100, backgroundColor: "#F5F6F7", borderRadius: 6 }}
                                        defaultValue={`Split Folio: ${selectedRowsFolio[0]?.dienGiai} - Value: ${selectedRowsFolio[0]?.thanhTien}`}
                                        onChange={(e) => onChange(e.target.value)}
                                        disabled
                                    />}
                                name="dienGiai" control={control}
                                defaultValue={`Split Folio: ${selectedRowsFolio[0]?.dienGiai} - Value: ${selectedRowsFolio[0]?.thanhTien}`} />
                        </div>
                    </div>
                </form>
            }
        />
    );
}
