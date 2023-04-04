import { Radio } from 'antd';
import { IPostingCommonFoodAndOther, PropsServiceCommon } from 'common/cashier/model-folio';
import { IFormRoomCharge } from 'common/cashier/model-form';
import { POSTING_FOLIO_DEFAULT } from 'common/const/postingMiniBarDefault';
import { ServiceHotelMa } from 'common/enum/cashier.enum';
import { TransactRoom } from 'common/model-booking';
import { IFixCharge } from 'common/model-hcfg';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import { addDays } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelectorRoot } from 'redux/store';
import FolioService from 'services/cashier/folio.service';
import search from 'services/search/search.service';
import { useStyleTheme } from 'theme';
import { styleCorrection } from './styles/stylesCorrection';

interface PropsAdvanceRoomChange extends PropsServiceCommon {
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    tsRoomGuid: string,
    fetchGroup(tsRomGuid: string): void

}
export const AdvanceRoomChange = ({ setShowModal, isShowModal, tsRoomGuid, groupGuidId, roomNumber, guestGuid, getDataFolio, getListGroupFolio, fetchGroup }: PropsAdvanceRoomChange): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const { hotelId } = useSelectorRoot(state => state.app);
    const [dataTsRoom, setDataTsRoom] = useState<TransactRoom | null>(null);
    const [typeAdvanceCharge, setTypeAdvanceCharge] = useState<number>(1);
    const [dateTo, setDateTo] = useState<Date>(new Date());
    const [dateFrom, setDateFrom] = useState<Date>(new Date());
    const [departureDate, setDepartureDate] = useState<Date>(addDays(new Date(), -1));
    const [chargeObject, setChargeObject] = useState<IFixCharge | null>(null);

    useEffect(() => {
        const fetchTsRoom = async () => {
            const res = await search.getTsRomById(tsRoomGuid);
            if (res) {
                setDataTsRoom(res);
                if (res.departureDate) {
                    const dateTo = Utils.convertToVNTimeZoneMbyMoment(res.departureDate);
                    setDateTo(addDays(new Date(dateTo), -1));
                    setDepartureDate(addDays(new Date(dateTo), -1));
                }
            }
        }
        fetchTsRoom();
    }, [hotelId, tsRoomGuid])

    useEffect(() => {
        const fetchCharge = async () => {
            const getChargeByCode = await FolioService.filterDataFixChargeByMa(hotelId, ServiceHotelMa.AdvanceRoomChange)
            setChargeObject(getChargeByCode)
        }
        fetchCharge();
    }, [hotelId])

    const onCancel = () => {
        setShowModal(false)
    }

    const onOk = async () => {
        const dataPosting = Object.assign({}, POSTING_FOLIO_DEFAULT);
        let ngayThang = new Date(businessDate);
        if (typeAdvanceCharge === 2) {
            ngayThang = addDays(new Date(dataTsRoom?.departureDate ?? ""), -1);
        }
        const formCommon: IPostingCommonFoodAndOther = {
            tsRoomId: tsRoomGuid ?? dataTsRoom?.guid,
            tinhChat: chargeObject?.tinhChat ?? "",
            thanhTien: dataTsRoom?.rate ?? 0
        }
        const basicInfo = {
            hotelGuid: hotelId,
            parentGuid: groupGuidId,
            ma: chargeObject?.ma ?? "",
            nguoiDung2: Utils.getValueLocalStorage("username"),
            language: ""
        }
        const data: IFormRoomCharge = {
            ngayThang: Utils.convertMiddleDate(ngayThang),
            dienGiai: "",
            donGia: 0,
            autoService: false
        }
        if (typeAdvanceCharge === 3) {
            data.dateFrom = Utils.convertMiddleDate(dateFrom);
            data.dateTo = Utils.convertMiddleDate(dateTo);
        }
        if (typeAdvanceCharge === 2) {
            data.dateFrom = Utils.convertMiddleDate(dateFrom);
            data.dateTo = Utils.convertMiddleDate(ngayThang);
        }
        if (chargeObject && roomNumber) {
            await FolioService.postingAdvanceRoomCharge(dataPosting, formCommon, chargeObject, guestGuid, basicInfo, data, roomNumber, typeAdvanceCharge);
            getDataFolio(groupGuidId);
            getListGroupFolio(tsRoomGuid)
        }
        fetchGroup(tsRoomGuid);
        setShowModal(false)

    }
    return (
        <CModel
            visible={isShowModal}
            title={t("CASHIER.FOLIO.advanceRoomCharge")}
            onOk={onOk}
            onCancel={onCancel}
            // width={"35%"}
            content={
                <form>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <Radio.Group defaultValue={typeAdvanceCharge}
                                value={typeAdvanceCharge}
                                onChange={(e) => setTypeAdvanceCharge(e.target.value)}
                            >
                                <Radio value={1}
                                    className={`${classes.titleCheckbox} flex-row items-center font-semibold w-full`}>
                                    {t("CASHIER.FOLIO.todayOnly")}
                                </Radio>
                                <Radio value={2}
                                    className={`${classes.titleCheckbox} flex-row items-center font-semibold w-full`}
                                    style={{ marginTop: "1rem" }}>
                                    {t("CASHIER.FOLIO.toDeparture")}
                                </Radio>
                                <Radio value={3} style={{ marginTop: "1rem" }}
                                    className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                >
                                    <div>
                                        {t("CASHIER.FOLIO.byDate")}
                                        <label className="m-0 font-base font-bold"> {t("BOOKING.SEARCHVALUE.from")}: </label>
                                        <DatePicker
                                            onChange={(date) => {
                                                setDateFrom(date ?? dateFrom)
                                            }}
                                            disabledDate={(valueDate) => {
                                                if (valueDate <= new Date(businessDate) && valueDate <= dateTo) {
                                                    return true;
                                                }
                                                return false;
                                            }}
                                            defaultValue={new Date(businessDate)}
                                            disabled={typeAdvanceCharge === 3 ? false : true}
                                            name="dateFrom"
                                            className={`${classes.datePicker}`} style={{ background: "#F5F6F7" }}
                                        />
                                        <label className="m-0 font-base font-bold"> {t("BOOKING.SEARCHVALUE.to")}: </label>
                                        <DatePicker
                                            onChange={(date) => {
                                                setDateTo(date ?? dateTo)
                                            }}
                                            disabledDate={(valueDate) => {
                                                if (valueDate >= departureDate) {
                                                    return true;
                                                }
                                                return false;
                                            }}
                                            value={dateTo}
                                            defaultValue={dateTo}
                                            disabled={typeAdvanceCharge === 3 ? false : true}
                                            name="dateTo"
                                            className={`${classes.datePicker} `} style={{ background: "#F5F6F7" }}
                                        />
                                    </div>
                                </Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </form>
            }
        />
    );
}
