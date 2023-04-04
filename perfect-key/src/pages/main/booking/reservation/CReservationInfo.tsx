/* eslint-disable */
import clsx from 'clsx'
import ClassBox from 'components/CClassBox'
import { useEffect, useState } from 'react'
import { Select } from "antd";
import { createStyles, useStyleTheme } from 'theme';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
const styleReservationInfo = createStyles((theme) => ({
    selectBackground: {
        "& .ant-select-selector": {
            backgroundColor: "#F5F6F7 !important",
            borderRadius: "4px !important",
            minHeight: "40px !important",
            display: "flex",
            alignItems: "center",
        },
        '& .ant-select-arrow': {
            color: "#1A87D7"
        }
    }
}))
export default function CReservationInfo(props: any): JSX.Element {
    const classes = useStyleTheme(styleReservationInfo);
    const { Option } = Select;
    const { control, selectOption, getGuestProfileByRsvnId, setValue, getValue } = props;
    const { t } = useTranslation("translation")
    useEffect(() => {
        if (getGuestProfileByRsvnId) {
            const changeObjectSpecials = JSON.parse(getGuestProfileByRsvnId.specialsCodes !== null ? getGuestProfileByRsvnId.specialsCodes : JSON.stringify({ specialsCodes: [] }));
            const changeObjectPackages = JSON.parse(getGuestProfileByRsvnId.packageCodes !== null ? getGuestProfileByRsvnId.packageCodes : JSON.stringify({ packageCodes: [] }));
            setValue('resChanel', getGuestProfileByRsvnId?.resChanel)
            setValue('origin', getGuestProfileByRsvnId?.origin)
            setValue('packageCodes', changeObjectPackages?.packageCodes)
            setValue('specialsCodes', changeObjectSpecials?.specialsCodes)
        }
    }, [])
    const renderSelect = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.guid}>{item.ten}</Option>
            )
        })
    }
    return (
        <ClassBox className={clsx(props.className)}>
            <div className="grid grid-cols-12 gap-4 pt-4 md:w-11/12 xl:w-full">
                <div className="col-span-6">
                    <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.rsvnChannel")}:</p>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.selectHere")}
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                value={getValue('resChanel') || undefined}
                            >
                                <Option value=""> </Option>
                                {selectOption ? renderSelect(selectOption.channels) : ""}
                            </Select>
                        }
                        name="resChanel" control={control} defaultValue="" />
                </div>
                <div className="col-span-6">
                    <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.origin")}:</p>
                    <Controller as={<Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.selectHere")}>
                        <Option value=""> </Option>
                        {selectOption ? renderSelect(selectOption.origins) : ""}
                    </Select>}
                        name="origin" control={control} defaultValue="" />
                </div>
                <div className="col-span-6">
                    <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.specials")}:</p>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select mode="multiple" className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.selectHere")}
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                value={getValue('specialsCodes') || undefined}
                            >
                                {selectOption ? renderSelect(selectOption.specials) : ""}
                            </Select>
                        }
                        name="specialsCodes" control={control} defaultValue="" />
                </div>
                <div className="col-span-6">
                    <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.packages")}:</p>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select 
                                className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.selectHere")}
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                value={value}
                            >
                                {selectOption ? renderSelect(selectOption.packages) : ""}
                            </Select>
                        }
                        name="packageCodes" control={control} defaultValue="" />
                </div>
            </div>
        </ClassBox >
    )
}
