/* eslint-disable */
import clsx from 'clsx'
import ClassBox from 'components/CClassBox'
import React from 'react'
import { Input } from "antd";
import { createStyles, useStyleTheme } from 'theme';
import { Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useState } from 'react';
import ProfileApi from 'api/profile/prf.api';
import FixChargeEdit from 'components/CModalFixCharge';
import CModalFlightInfo from 'components/CModalFlightInfo';
import CModalPickUp from 'components/CModalPickUp';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { setDataFoextraCharge } from 'redux/controller/reservation.slice';
import Utils from 'common/utils';
import FixChargesService from 'services/booking/fixcharges.service';
import { useTranslation } from 'react-i18next';

const styleBooker = createStyles((theme) => ({
    inputStyle: {
        height: 40,
        background: "#F5F6F7",
        borderRadius: "6px !important",
    },
    input: {
        marginLeft: 1,
        marginRight: 1,
    },
    charge: {
        "& .ant-input-wrapper": {
            height: 40,
            "& .ant-input-group-addon": {
                borderBottomLeftRadius: 6,
                borderTopLeftRadius: 6,
                background: "linear-gradient(180deg, #E8E8E8 0%, #CECECE 100%)",
                color: "#00293B",
                fontWeight: 600,
                textAlign: "left",
                opacity: 1,
                width: 152,
            },
            "& .ant-input": {
                background: "#F5F6F7",
                borderBottomRightRadius: 6,
                borderTopRightRadius: 6,
                height: 40
            }
        },
        "& .ant-input-group-addon": {
            cursor: "pointer"
        }
    }

}))
function CBookerInfo(props: any): JSX.Element {
    const { control, dataForeservationDTO, setValue, getValue,dataFoextraCharges } = props;
    const dispatch = useDispatchRoot();
    const classes = useStyleTheme(styleBooker);
    const [bookerName, setBookerName] = useState('');
    const [isVisibleMFixC, setVisibleMFixC] = useState<boolean>(false);
    const [isVisibleMPickup, setVisibleMPickup] = useState<boolean>(false);
    const [isVisibleMFlight, setVisibleMFlight] = useState<boolean>(false);
    const { totalFixCharge } = useSelectorRoot(state => state.rsvn);
    const [isEdit,setIsEdit] = useState<boolean>(false);
    const { t } = useTranslation("translation")
    useEffect(() => {
        if (dataForeservationDTO) {
            ProfileApi.getGuestProfileById(dataForeservationDTO.bookedBy).subscribe(
                (res: any) => {
                    setBookerName(res.firstName + " " + res.guestName);
                },
                (err) => {
                    alert("Error when booking a reservation!");
                    console.log(err);
                }
            )
            setValue('bookByPhone',dataForeservationDTO?.bookByPhone)
            setValue('bookByEmail',dataForeservationDTO?.bookByEmail)
            setValue('bookByFax',dataForeservationDTO?.bookByFax)

        }
        if(dataFoextraCharges.length > 0){
            const totalFixCharge = FixChargesService.setTotalAmountFixCharge(dataFoextraCharges);
            dispatch(setDataFoextraCharge({ totalFixCharge, dataFoextraCharge: dataFoextraCharges}));
            setIsEdit(true);
        }
        else{
            dispatch(setDataFoextraCharge({ totalFixCharge : 0, dataFoextraCharge: []}));
        }
    }, [dataForeservationDTO])
    return (
        <ClassBox>
            <div className={clsx(props.className)}  >
                <div className={`col-span-6 ${classes.input}`}>
                    <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.bookerName")}:</p>
                    <Controller
                        // as={<Input className={`!rounder-md ${classes.inputStyle}`} placeholder="Input here" />}
                        render={({ onChange, value, ref }) =>
                            <Input className={`!rounder-md ${classes.inputStyle}`} placeholder={t("BOOKING.RESERVATION.inputHere")}
                                onChange={(e) => {
                                    onChange(e)
                                    setBookerName(e.target.value)
                                }}
                                value={bookerName || undefined}
                            />
                        }
                        name="bookedBy" value={bookerName} control={control} defaultValue=""
                    />
                </div>
                <div className="col-span-6">
                    <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.bookerPhone")}:</p>
                    <Controller
                        // as={<Input className={`!rounder-md ${classes.inputStyle}`} placeholder="Input here"></Input>}
                        render={({ onChange, value, ref }) =>
                            <Input className={`!rounder-md ${classes.inputStyle}`} placeholder={t("BOOKING.RESERVATION.inputHere")}
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                value={getValue('bookByPhone') || undefined}
                            />
                        }
                        name="bookByPhone" defaultValue="" control={control} />
                </div>
                <div className="col-span-6">
                    <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.bookerEmail")}:</p>
                    <Controller
                        // as={<Input className={`!rounder-md ${classes.inputStyle}`} placeholder="Input here"></Input>}
                        render={({ onChange, value, ref }) =>
                            <Input className={`!rounder-md ${classes.inputStyle}`} placeholder={t("BOOKING.RESERVATION.inputHere")}
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                value={getValue('bookByEmail') || undefined}
                            />
                        }
                        name="bookByEmail" defaultValue="" control={control} />
                </div>
                <div className="col-span-6">
                    <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.bookerFax")}:</p>
                    <Controller
                        // as={<Input className={`!rounder-md ${classes.inputStyle}`} placeholder="Input here"></Input>}
                        render={({ onChange, value, ref }) =>
                            <Input className={`!rounder-md ${classes.inputStyle}`} placeholder={t("BOOKING.RESERVATION.inputHere")}
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                value={getValue('bookByFax') || undefined}
                            />
                        }
                        name="bookByFax" defaultValue="" control={control} />
                </div>
                <div className="col-span-12 border-dashed border-t my-4"></div>
                <div className="col-span-12 grid-cols-12 grid gap-2" style={{ marginLeft: 2.5, marginRight: 2.5 }}>
                    <Input
                        value={totalFixCharge === 0 ? undefined : Utils.formatNumber(totalFixCharge)}
                        style={{ background: "#F5F6F7" }} className={`${classes.charge} col-span-12 w-full !rounder-md`}
                        addonBefore={<div className="w-full h-full flex items-center" onClick={() => setVisibleMFixC(true)}>{t("BOOKING.RESERVATION.fixCharge")}</div>}
                        defaultValue="" placeholder="Total fix charge"
                    />
                    <Input

                        style={{ background: "#F5F6F7" }} className={`${classes.charge} col-span-12 w-full !rounder-md`}
                        addonBefore={<div className="w-full h-full flex items-center" onClick={() => setVisibleMPickup(true)}>{t("BOOKING.RESERVATION.pickup")}</div>}
                        defaultValue="" placeholder="Car pickup info here"
                    />
                    <Input style={{ background: "#F5F6F7" }} className={`${classes.charge} col-span-12 w-full !rounder-md`}
                        addonBefore={<div className="w-full h-full flex items-center" onClick={() => setVisibleMFlight(true)}>{t("BOOKING.RESERVATION.flight")}</div>}
                        defaultValue="" placeholder="Flight info here"
                    />
                </div>
            </div>
            {isVisibleMFixC ?
                <FixChargeEdit key={`md-01`}
                    isMain={true}
                    visible={isVisibleMFixC} setVisibleMFix={setVisibleMFixC} isEdit={isEdit} />
                : ""
            }
            <CModalPickUp key={`md-02`}
                visible={isVisibleMPickup} setVisible={setVisibleMPickup}
            />
            <CModalFlightInfo key={`md-03`}
                visible={isVisibleMFlight} setVisible={setVisibleMFlight}
            />
        </ClassBox>
    )
}
export default React.memo(CBookerInfo);