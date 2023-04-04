/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CModelCashier from "components/CModalCashier";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import { styleInput } from 'pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style'
import { Checkbox, Input, Select } from "antd";
import DatePicker from "components/CDatePicker";
import ClassBox from "components/CClassBox";
import MiniBar from "./Table/MiniBar";
import { ChildModalCashier, ServiceHotelMa } from "common/enum/cashier.enum";
import Laundry from "./Table/Laundry";
import HotelConfigService from "services/hcfg/hcfg.service";
import { useSelectorRoot } from "redux/store";
import { ITableMinibarAndLaundry } from "common/cashier/model-cashier";
import FolioService from "services/cashier/folio.service";
import { IDataLaundryMaping, IFormCommonPosting, IFormMiniBarOrLaundry } from "common/cashier/model-folio";
import { useParams } from "react-router";
import Utils from "common/utils";
import { POSTING_MINIBAR_DEFAULT } from "common/const/postingMiniBarDefault";
import { IFixCharge } from "common/model-hcfg";
import { Languagues } from "common/enum/language.enum";
import { POSTING_LAUNDRY_DEFAULT } from "common/const/postingDefaultLaundry";
import FolioHelper from "services/cashier/helper/folio.helper";
import { dataGuest } from "common/model-profile";
import CLoading from "components/CLoading";
import CashierService from "services/cashier/cashier.service";
const { Option } = Select;
const { TextArea } = Input;
interface PropsMinibarOrLaundry {
    isMiniBarOrLaundry: boolean,
    setMiniBarOrLaundry: React.Dispatch<React.SetStateAction<boolean>>,
    childTable: number,
    groupGuidId: string,
    getDataFolio: any;
    getListGroupFolio: any;
    fullName: string,
    roomNumber: string,
    guestGuid: string,
    dataGuestSelector: dataGuest[],
    fetchGroup(tsRomGuid: string): void
}
interface IParam {
    tsRoomGuid: string;
}
const MiniBarOrLaundry = ({
    isMiniBarOrLaundry, setMiniBarOrLaundry, childTable, groupGuidId, getDataFolio,
    getListGroupFolio, fullName, roomNumber, guestGuid, dataGuestSelector, fetchGroup }: PropsMinibarOrLaundry) => {
    const classes = useStyleTheme(styleInput);
    const { t } = useTranslation("translation")
    const { handleSubmit, control, setValue, getValues, reset } = useForm();
    const params: IParam = useParams();

    const { listGoodsMinibar, listGoodsLaundry } = useSelectorRoot(state => state.folio)
    const { hotelId } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);

    const [dataTable, setDataTable] = useState<ITableMinibarAndLaundry[]>([]);
    const [dataTableLaundry, setDataTableLaundry] = useState<IDataLaundryMaping[]>([]);
    const [chargeObject, setChargeObject] = useState<IFixCharge | null>(null)
    const [freeCharge, setFreeCharge] = useState(false);
    const [express, setExpress] = useState(false);
    const [isDone, setIsDone] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
    const [groupFolioGuid, setGroupFolioGuid] = useState<string>("");
    const [guestSelected, setGuestSelected] = useState<dataGuest[]>([]);
    const [valueExpressService, setValueExpressService] = useState<number>(0);

    useEffect(() => {
        const select = dataGuestSelector

        dataGuestSelector.forEach((item, index) => {
            if (item.guestGuid === guestGuid) {
                const tmp = dataGuestSelector[0]
                select[0] = item
                select[index] = tmp
            }
        })
        setGuestSelected(select)
    }, [dataGuestSelector])

    useEffect(() => {
        const getChargeInHotel = async () => {
            setIsLoadingBtn(true);
            let maCharge = ""
            if (childTable === ChildModalCashier.MiniBar) {
                maCharge = ServiceHotelMa.MiniBar
            } else if (childTable === ChildModalCashier.Laundry)
                maCharge = ServiceHotelMa.Laundry

            const getChargeInHotel = await FolioService.filterDataFixChargeByMa(hotelId, maCharge)
            setChargeObject(getChargeInHotel)
            setIsLoadingBtn(false);
        }
        getChargeInHotel()
    }, [childTable, hotelId])

    useEffect(() => {
        const getVoucherId = async () => {
            const idVoucher = await FolioHelper.getVoucerMiniBarOrLaundry(hotelId, childTable);
            setValue("so", idVoucher);
        }
        getVoucherId()
    }, [childTable, hotelId, isMiniBarOrLaundry, setValue, isLoading])

    useEffect(() => {
        handleCalculate()
    }, [listGoodsLaundry, listGoodsMinibar, freeCharge, express])

    useEffect(() => {
        if (isMiniBarOrLaundry) {
            childTable === ChildModalCashier.MiniBar ? fetchMiniBar() : fetchLaundry();
        }
    }, [childTable, hotelId, isMiniBarOrLaundry, isLoading])
    const fetchMiniBar = async () => {
        const resp = await HotelConfigService.getAllMiniBar(hotelId);
        if (resp) {
            setDataTable(resp);
        }
    }
    const fetchLaundry = async () => {
        const resp = await HotelConfigService.getAllLaundry(hotelId);
        const respDmuc = await HotelConfigService.getDmucTuyChonByMaAndHotelId(ServiceHotelMa.ExpressService, hotelId)
        if (resp || respDmuc) {
            setDataTableLaundry(resp);
            setValueExpressService(parseInt(respDmuc?.giaTri ?? "0"));
        }
    }
    const handleCalculate = () => {
        let dataGoods = [];
        let valueThanhTien = 0;
        let valueSC = 0
        let valueVAT = 0
        let totalValue = 0
        let valueExpress = 0;
        const rateDiscount = Number.parseInt(getValues("tyLeGiamTru"))
        let valueDiscount = 0

        childTable === ChildModalCashier.MiniBar ?
            dataGoods = listGoodsMinibar :
            dataGoods = listGoodsLaundry;
        dataGoods.forEach((item) => {
            if (item?.thanhTien)
                valueThanhTien += item?.thanhTien
        })
        if (valueThanhTien && chargeObject) {
            valueDiscount = valueThanhTien * rateDiscount / 100
            valueSC = (valueThanhTien - valueDiscount) * (chargeObject?.tyLePhiDichVu / 100);

            if (express && childTable === ChildModalCashier.Laundry) {
                valueExpress = (valueThanhTien - valueDiscount + valueSC) * (valueExpressService / 100);
                valueVAT = (valueThanhTien - valueDiscount + valueSC + valueExpress) * (chargeObject?.tyLeThueVat / 100);
                totalValue = getValues("freeCharge") as boolean ? 0 : valueThanhTien - valueDiscount + valueSC + valueVAT + valueExpress;
            }
            else {
                valueVAT = (valueThanhTien - valueDiscount + valueSC) * (chargeObject?.tyLeThueVat / 100);
                totalValue = getValues("freeCharge") as boolean ? 0 : valueThanhTien - valueDiscount + valueSC + valueVAT
            }
            setValue("thanhTien", Utils.formatNumber(valueThanhTien))
            // setValue("soTienGiamTru", Utils.formatNumber(valueDiscount))
            setValue("servicesCharge", Utils.formatNumber(valueSC))
            setValue("vatcharge", Utils.formatNumber(valueVAT))
            setValue("tongSoTien", Utils.formatNumber(totalValue))
        }

        return {
            thanhTien: valueThanhTien,
            tiLeGiamTru: rateDiscount,
            soTienGiamTru: valueDiscount,
            valueSC: valueSC,
            valueVAT: valueVAT,
            totalValue: totalValue,
            expressService: valueExpress
        }
    }

    const onSubmit = async (data: IFormMiniBarOrLaundry) => {
        if (chargeObject) {
            setIsLoadingBtn(true);
            const dataCharge = handleCalculate()
            let dataGoods = [];
            let serviceNameForLanguage = ""
            const getValue = localStorage.getItem("LANGUAGE")
            if (getValue === Languagues.VietNam) {
                chargeObject.tenVn !== "" ?
                    serviceNameForLanguage = chargeObject.tenVn :
                    serviceNameForLanguage = chargeObject.ten
            } else
                serviceNameForLanguage = chargeObject.ten

            childTable === ChildModalCashier.MiniBar ?
                dataGoods = listGoodsMinibar :
                dataGoods = listGoodsLaundry;
            const formCommon: IFormCommonPosting = {
                tsRoomId: params.tsRoomGuid,
                tinhChat: chargeObject.tinhChat,
                parentGuid: data.guest !== guestGuid ? groupFolioGuid : groupGuidId,
                maTk: chargeObject.ma?.toString(),
                ma: chargeObject.ma?.toString(),
                hotelGuid: hotelId,
                nguoiDung2: Utils.getValueLocalStorage("username"),
                ten: serviceNameForLanguage
            }

            if (childTable === ChildModalCashier.MiniBar) {
                const dataDefaultPosting = Object.assign({}, POSTING_MINIBAR_DEFAULT);
                await FolioService.postingMiniBar(dataDefaultPosting, dataGoods, data, formCommon, ServiceHotelMa.MiniBar, dataCharge);
                setIsDone(false);
            }
            else {
                const dataDefaultPostingLaundry = Object.assign({}, POSTING_LAUNDRY_DEFAULT);
                await FolioService.postingLaundry(dataDefaultPostingLaundry, dataGoods, data, formCommon, dataCharge);
                setIsDone(false);
            }
            fetchGroup(params.tsRoomGuid);
            setIsLoading(!isLoading);
            setIsLoadingBtn(false);
            reset();

        }
    }
    const handleDisableBtnOk = (): boolean => {
        if (childTable === ChildModalCashier.MiniBar) {
            return listGoodsMinibar.length > 0 ? false : true;
        }
        if (childTable === ChildModalCashier.Laundry) {
            return listGoodsLaundry.length > 0 ? false : true;
        }
        return true;
    }
    const handleOK = () => { handleCalculate() }
    const handleCancel = () => {
        setMiniBarOrLaundry(false)
        setValue("thanhTien", 0)
        setValue("tiLeGiamTru", 0)
        setValue("soTienGiamTru", 0)
        setValue("servicesCharge", 0)
        setValue("vatcharge", 0)
        setValue("tongSoTien", 0)
    }

    const handleChangeValueDiscount = (value: number, type: number) => {
        if (getValues("thanhTien")) {
            if (type === 1) {
                const valueDiscount = Utils.parseLocaleNumber(getValues("thanhTien")) * (value / 100)
                setValue("soTienGiamTru", valueDiscount ? Utils.formatNumber(valueDiscount) : 0)
            } else {
                const valueDiscountRate = (value * 100) / Utils.parseLocaleNumber(getValues("thanhTien"));
                setValue("tyLeGiamTru", valueDiscountRate ? valueDiscountRate : 0)
            }
            handleCalculate()
        }
    }
    const handleDone = () => {
        getDataFolio(groupGuidId);
        fetchGroup(params.tsRoomGuid);
        getListGroupFolio(params.tsRoomGuid);
        setMiniBarOrLaundry(false);
    }

    const handleChangeGuest = async (e: string) => {
        if (e !== guestGuid) {
            const tsRoomGuest = dataGuestSelector.find((item) => item.guestGuid === e)
            if (tsRoomGuest) {
                const res = await CashierService.getFolioGroup(tsRoomGuest.tsRoomId);
                res && setGroupFolioGuid(res[0].guidGroupFolio);
            }
        }
    }
    return (
        <div>
            <CModelCashier
                title={childTable === ChildModalCashier.MiniBar ? `${t("CASHIER.FOLIO.minibarForGuest")}: ${fullName}` : `${t("CASHIER.FOLIO.otherLaundryForGuest")}: ${fullName}`}
                visible={isMiniBarOrLaundry}
                onCancel={handleCancel}
                myForm="form-minibar"
                style={{ top: "3%" }}
                isLoading={isLoadingBtn}
                width={"80%"}
                onOk={handleOK}
                onDone={handleDone}
                disableBtn={handleDisableBtnOk()}
                disableDone={isDone}
                disableClose={!handleDisableBtnOk()}
                content={
                    <CLoading visible={isLoadingBtn}>
                        <form onSubmit={handleSubmit(onSubmit)} id="form-minibar">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="grid grid-cols-12 col-span-12 gap-4">
                                    <div className="col-span-4">
                                        <label className="m-0 font-base font-bold">{t("BOOKING.date")}:</label>
                                        <Controller
                                            name="ngayThang"
                                            render={({ onChange, value }) =>
                                                <DatePicker
                                                    onChange={(date) => {
                                                        onChange(date)
                                                    }}
                                                    defaultValue={new Date(businessDate)}
                                                    value={value}
                                                    className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                                    name="ngayThang"
                                                />}
                                            control={control} defaultValue={new Date(businessDate)} />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="m-0 font-base font-bold">
                                            {t("CASHIER.FOLIO.voucherNo")}:
                                        </label>
                                        <Controller
                                            render={({ onChange, value, ref }) =>
                                                <Input
                                                    className={`${classes.input}`}
                                                    maxLength={8}
                                                    type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                    value={value} onChange={(e) => { onChange(e.target.value) }}
                                                    required={true}
                                                >
                                                </Input>}
                                            name="so" control={control} defaultValue={""} />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="m-0 font-base font-bold">
                                            {t("CASHIER.roomNo")}:
                                        </label>
                                        <Controller
                                            render={({ onChange, value, ref }) =>
                                                <Input
                                                    className={`${classes.input}`}
                                                    defaultValue={roomNumber}
                                                    type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                    value={value} onChange={(e) => { onChange(e.target.value) }} >
                                                </Input>}
                                            name="soPhong" control={control} defaultValue={roomNumber} />
                                    </div>
                                </div>
                                <div className="col-span-8">
                                    {childTable === ChildModalCashier.MiniBar ?
                                        <MiniBar dataTable={dataTable} height={300} />
                                        :
                                        <Laundry dataTableLaundry={dataTableLaundry} height={300} />
                                    }
                                </div>
                                <ClassBox className="col-span-4 custom-scrollbar-pkm">
                                    <div className="grid grid-cols-2 gap-2" style={{ height: "calc(100vh - 340px)" }}>
                                        <div className="col-span-2 mt-2">
                                            <label className="m-0 font-base font-bold">
                                                {t("CASHIER.FOLIO.guestName")}:
                                            </label>
                                            <Controller
                                                render={({ onChange, value, ref }) =>
                                                    <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                                        showSearch
                                                        value={value}
                                                        defaultValue={guestGuid}
                                                        onChange={(e) => {
                                                            onChange(e)
                                                            handleChangeGuest(e)
                                                        }}
                                                    >
                                                        {guestSelected.map((item: any, index: any): JSX.Element => {
                                                            return (
                                                                <Option key={index} value={item.guestGuid}>{item.fullName}</Option>
                                                            )
                                                        })
                                                        }
                                                    </Select>
                                                }
                                                name="guest" control={control} defaultValue={guestGuid} />
                                        </div>
                                        <div className="xl:col-span-1 col-span-2">
                                            <label className="m-0 font-base font-bold">
                                                {t("CASHIER.FOLIO.value")}:
                                            </label>
                                            <Controller
                                                render={({ onChange, value, ref }) =>
                                                    <Input
                                                        placeholder={"0"}
                                                        className={`${classes.input}`}
                                                        type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                        value={value}
                                                        onChange={(e) => {
                                                            onChange(e.target.value)
                                                        }} >
                                                    </Input>}
                                                name="thanhTien" control={control} defaultValue={0} />
                                        </div>
                                        <div className="xl:col-span-1 col-span-2">
                                            <label className="m-0 font-base font-bold">
                                                {t("CASHIER.FOLIO.discount")} (%):
                                            </label>
                                            <Controller
                                                render={({ onChange, value, ref }) =>
                                                    <Input
                                                        className={`${classes.input}`}
                                                        placeholder={"0"}
                                                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                                                        value={value}
                                                        onChange={(e) => {
                                                            e.target.value ? onChange(Number.parseInt(e.target.value)) : onChange(0)
                                                            e.target.value ? handleChangeValueDiscount(Number.parseInt(e.target.value), 1) : handleChangeValueDiscount(0, 1)
                                                        }} >
                                                    </Input>}
                                                name="tyLeGiamTru" control={control} defaultValue={0} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="m-0 font-base font-bold">
                                                {t("CASHIER.FOLIO.valueDiscount")}:
                                            </label>
                                            <Controller
                                                render={({ onChange, value, ref }) =>
                                                    <Input
                                                        className={`${classes.input}`}
                                                        placeholder={"0"}
                                                        type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                        value={value}
                                                        onChange={(e) => {
                                                            e.target.value ? onChange(Number.parseInt(e.target.value)) : onChange(0)
                                                            e.target.value ? handleChangeValueDiscount(Number.parseInt(e.target.value), 2) : handleChangeValueDiscount(0, 2)
                                                        }} >
                                                    </Input>}
                                                name="soTienGiamTru" control={control} defaultValue={0} />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="m-0 font-base font-bold">
                                                {t("CASHIER.FOLIO.sc")}:
                                            </label>
                                            <Controller
                                                render={({ onChange, value, ref }) =>
                                                    <Input
                                                        placeholder={"0"}
                                                        className={`${classes.input}`}
                                                        type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                        value={value}
                                                        onChange={(e) => {
                                                            onChange(Number.parseInt(e.target.value))
                                                        }} >
                                                    </Input>}
                                                name="servicesCharge" control={control} defaultValue={0} />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="m-0 font-base font-bold">
                                                {t("CASHIER.FOLIO.VAT")}:
                                            </label>
                                            <Controller
                                                render={({ onChange, value, ref }) =>
                                                    <Input
                                                        placeholder={"0"}
                                                        className={`${classes.input}`}
                                                        type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                        value={value}
                                                        onChange={(e) => {
                                                            onChange(Number.parseInt(e.target.value))
                                                        }} >
                                                    </Input>}
                                                name="vatcharge" control={control} defaultValue={0} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="m-0 font-base font-bold">
                                                {t("CASHIER.FOLIO.totalAmount")}:
                                                <Controller render={(
                                                    { onChange, onBlur, value, name, ref }) => (
                                                    <Checkbox
                                                        className={`${classes.titleCheckbox} flex-row items-center font-semibold float-right`}
                                                        defaultChecked={false}
                                                        onChange={(e) => {
                                                            onChange(e.target.checked)
                                                            setFreeCharge(e.target.checked)
                                                        }}>
                                                        Free Charge
                                                    </Checkbox>
                                                )}
                                                name="freeCharge" defaultValue={false} control={control} />

                                            </label>
                                            <Controller
                                                render={({ onChange, value, ref }) =>
                                                    <Input
                                                        placeholder={"0"}
                                                        className={`${classes.input}`}
                                                        type="text" style={{ background: "#F5F6F7", height: 40 }}
                                                        value={value}
                                                        onChange={(e) => {
                                                            onChange(Number.parseInt(e.target.value))
                                                        }} >
                                                    </Input>}
                                                name="tongSoTien" control={control} defaultValue={0} />
                                        </div>
                                        <div className="col-span-2 pb-3">
                                            <label className="m-0 font-base font-bold">
                                                {t("CASHIER.FOLIO.remark")}:
                                            </label>
                                            <Controller render={({ onChange, value, ref }) =>
                                                <TextArea className={`${classes.textArea} w-full col-span-12`}
                                                    style={{ height: 100, backgroundColor: "#F5F6F7", borderRadius: 6 }}
                                                    placeholder="Input comment here"
                                                    onChange={(e) => onChange(e.target.value)}
                                                />
                                            }
                                            name="ghiChu" defaultValue="" control={control}
                                            />
                                        </div>

                                        {childTable === ChildModalCashier.Laundry ?
                                            <div className="xl:col-span-1 col-span-2 pb-3">
                                                <Controller render={(
                                                    { onChange, onBlur, value, name, ref }) => (
                                                    <Checkbox
                                                        className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                                        defaultChecked={false}
                                                        onChange={(e) => {
                                                            onChange(e.target.checked)
                                                            setExpress(e.target.checked)
                                                        }}>
                                                        {t("CASHIER.FOLIO.expressService")}
                                                    </Checkbox>
                                                )}
                                                name="expressService" defaultValue={false} control={control} />
                                            </div>
                                            : ""}
                                    </div>
                                </ClassBox>
                            </div>
                        </form>
                    </CLoading>
                }
            />
        </div>
    )
}
export default React.memo(MiniBarOrLaundry);