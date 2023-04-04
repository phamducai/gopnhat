/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "antd"
import ClassBox from "components/CClassBox"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useStyleTheme } from "theme"
import { editProfilesStyle } from "../styles/editProfiles"

const CFormSearch = (props: any): JSX.Element => {
    const classes = useStyleTheme(editProfilesStyle)
    const {firstName, setFirstName, lastName, setLastName, passport, setPassport, mobilePhone, setMobilePhone, handleMerge, countTable} = props
    const { control } = useForm()
    const { t } = useTranslation("translation")

    return (
        <ClassBox>
            <p className="font-bold pt-4">Total Guests Profiles: {countTable}</p>
            <div className={`grid grid-cols-12`}>
                <div className="col-span-12 mb-4">
                    <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.FORMGUESTPROFILE.firstname")}:</p>
                    <Controller
                        render={({ onChange, value }) =>
                            <Input
                                className={`${classes.input} w-full`}
                                style={{ background: "#F5F6F7" }}
                                onChange={(e: any) => {
                                    onChange(e)
                                    setFirstName(e.target.value)
                                }}
                                defaultValue={firstName}
                                value={value}
                                name="firstName"
                            />
                        }
                        defaultValue=""
                        value={firstName}
                        name="FirstName"
                        control={control}
                    />
                </div>
                <div className="col-span-12 mb-4">
                    <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.FORMGUESTPROFILE.passport")}:</p>
                    <Controller
                        render={({ onChange, value }) =>
                            <Input
                                className={`${classes.input} w-full`}
                                style={{ background: "#F5F6F7" }}
                                onChange={(e: any) => {
                                    onChange(e)
                                    setPassport(e.target.value)
                                }}
                                defaultValue={passport}
                                value={value}
                                name="passport"
                            />
                        }
                        defaultValue=""
                        value={passport}
                        name="Passport"
                        control={control}
                    />
                </div>
                <div className="col-span-12 mb-4">
                    <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.lastname")}:</p>
                    <Controller
                        render={({ onChange, value }) =>
                            <Input
                                className={`${classes.input} w-full`}
                                style={{ background: "#F5F6F7" }}
                                onChange={(e: any) => {
                                    onChange(e)
                                    setLastName(e.target.value)
                                }}
                                defaultValue={lastName}
                                value={value}
                                name="lastName"
                            />
                        }
                        defaultValue=""
                        value={lastName}
                        name="LastName"
                        control={control}
                    />
                </div>
                <div className="col-span-12">
                    <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.mobilePhone")}:</p>
                    <Controller
                        render={({ onChange, value }) =>
                            <Input
                                className={`${classes.input} w-full`}
                                style={{ background: "#F5F6F7" }}
                                onChange={(e: any) => {
                                    onChange(e)
                                    setMobilePhone(e.target.value)
                                }}
                                defaultValue={mobilePhone}
                                value={value}
                                name="mobilePhone"
                            />
                        }
                        defaultValue=""
                        value={mobilePhone}
                        name="MobilePhone"
                        control={control}
                    />
                </div>
                <div className="col-span-12 mt-6">
                    <button onClick={() => handleMerge()} 
                        className={`${classes.btn} flex items-center justify-center`}>
                        <span>Search</span>
                    </button>
                </div>
            </div>
        </ClassBox>
    )
}
export default React.memo(CFormSearch)