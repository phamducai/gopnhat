/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { PrinterOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { getBookingByRsvnId } from 'redux/controller/reservation.slice';
import clsx from 'clsx';
import { useStyleTheme } from "theme/Theme";
import { styleSearchResults } from '../../searchResults/styles/styleSearchResults';
import { getGuestDetailsOptionsRequest, getGuestMoreDetailsRequest } from 'redux/controller/reservation.slice';
import { useDispatchRoot } from "redux/store";
import { useSelectorRoot } from "redux/store";

import DrawerProfile from "components/CDrawerProfile/CDrawerProfile";
import FormGuestProfile from 'components/CFormProfile/CFormGuest/CFormGuestProfile';
import CompanyAgentProfile from 'components/CFormProfile/CFormCompany/CFormCompanyProfile';
import { GuestProfileFormData } from 'common/const/guestProfileFormData';
import { GUEST_PRF_DEFAULT_NORSVN } from 'common/const/guestProfileDefaultValue';
import { GuestProfileNoRsvn } from "common/model-profile";
import { CompanyProfile } from "common/model-profile";
import ProfilesService from "services/booking/profilesNoRsvn/profiles.service";
import CompanyService from "services/booking/company.service";

import openNotification from "components/CNotification";
import { NotificationStatus } from "common/enum/shared.enum";
import { useTranslation } from 'react-i18next';

interface IDrawersNewProfiles {
    guestGuidBeUpdated?: string
    setGuestGuidBeUpdated?: any
    visibleNewGuestProfile: boolean
    setVisibleNewGuestProfile: any
    companyGuidBeUpdated?: string
    setCompanyGuidBeUpdated?: any
    visibleCompanyProfile: boolean
    setVisibleNewCompanyProfile: any
    isDisableEdit: boolean
}

const Index = (props: IDrawersNewProfiles): JSX.Element => {
    const {
        guestGuidBeUpdated,
        setGuestGuidBeUpdated,
        visibleNewGuestProfile,
        setVisibleNewGuestProfile,
        companyGuidBeUpdated,
        setCompanyGuidBeUpdated,
        visibleCompanyProfile,
        setVisibleNewCompanyProfile,
        isDisableEdit
    } = props

    const classes = useStyleTheme(styleSearchResults);

    const [changeTabs, setChangeTabs] = useState<any>();
    const [onOkGP, setOnOkGP] = useState<boolean>(false)
    const [btnLoadingGP, setBtnLoadingGP] = useState<boolean>(false)
    const [selectKind, setSelectKind] = useState<any>('')
    const [submitCompany, setSubmitCompany] = useState<boolean>(false);
    // const [, setNewGuestProfileGuids] = useState<string[]>([])
    const [listGuestProfiles, setListGuestProfiles] = useState<GuestProfileNoRsvn[]>([])
    const [guestInfoByGuid, setGuestInfoByGuid] = useState<GuestProfileNoRsvn | null>(null)
    const [companyInfoByGuid, setCompanyInfoByGuid] = useState<CompanyProfile | null>(null)
    const { t } = useTranslation("translation")
    const { hotelId } = useSelectorRoot(state => state.app);
    const dispatch = useDispatchRoot()

    const onCloseGuest = () => {
        setVisibleNewGuestProfile(false)
        if (guestGuidBeUpdated !== "") {
            setGuestGuidBeUpdated("")
        }
        if (guestInfoByGuid !== null) {
            setGuestInfoByGuid(null)
        }
    }
    const onCloseCompany = () => {
        setVisibleNewCompanyProfile(false);
        if (companyGuidBeUpdated !== "") {
            setCompanyGuidBeUpdated("")
        }
        if (companyInfoByGuid !== null) {
            setCompanyInfoByGuid(null)
        }
    }
    const transformData = (obj: any, destination: any) => {
        Object?.keys(destination)?.map(key => {
            if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined)
                destination[key] = obj[key];
            return null;
        });
    }
    // Push guest to List guest profiles
    const handleGuestProfile = (formData: GuestProfileFormData) => {
        const pre = { ...GUEST_PRF_DEFAULT_NORSVN, hotelGuid: hotelId }; //hotelGuid = null
        transformData(formData.main, pre);
        transformData(formData.more, pre);
        if (onOkGP) {
            setListGuestProfiles([...listGuestProfiles, pre])
            setBtnLoadingGP(true)
            setTimeout(() => {
                setBtnLoadingGP(false)
                setOnOkGP(false)
            }, 1000);
        }
    }
    const postListGuestProfiles = async (listData: GuestProfileNoRsvn[]) => {
        await ProfilesService.createNewGuestProfiles(listData)
        // const newGuids: any = await ProfilesService.createNewGuestProfiles(listData)
        // if (newGuids) {
        //     setNewGuestProfileGuids(newGuids)
        // }
    }
    // Post List guest profiles to api
    const handlePostListGuestProfiles = () => {
        postListGuestProfiles(listGuestProfiles)
        setListGuestProfiles([])
        setVisibleNewGuestProfile(false)
    }
    const getGuestProfileByGuestGuid = async (guid: string) => {
        const res = await ProfilesService.getGuestProfileByGuid(guid)
        if (res) {
            setGuestInfoByGuid(res)
            setVisibleNewGuestProfile(true)
        } else {
            setGuestGuidBeUpdated("")
            openNotification(NotificationStatus.Error, "Could not find this Guest!", "Please try again.");
        }
    }
    const updateGuestProfile = async (data: GuestProfileNoRsvn) => {
        if (guestGuidBeUpdated) {
            await ProfilesService.editGuestProfile(data, guestGuidBeUpdated)
        }
    }
    // Update guest profile by guid
    const handleUpdateGuestProfile = () => {
        const updatedData: GuestProfileNoRsvn = listGuestProfiles[0]
        updateGuestProfile(updatedData)
        setVisibleNewGuestProfile(false)
        setGuestGuidBeUpdated("")
    }
    const getCompanyProfileByGuestGuid = async (guid: string) => {
        const res = await CompanyService.getCompanyByGuid(guid)
        if (res) {
            setCompanyInfoByGuid(res)
            setVisibleNewCompanyProfile(true)
        } else {
            setCompanyGuidBeUpdated("")
            openNotification(NotificationStatus.Error, "Could not find this Company/ Agent!", "Please try again.");
        }
    }
    useEffect(() => {
        dispatch(getGuestDetailsOptionsRequest(hotelId));
        dispatch(getGuestMoreDetailsRequest(hotelId));
        if (guestGuidBeUpdated) {
            getGuestProfileByGuestGuid(guestGuidBeUpdated)
        }
    }, [guestGuidBeUpdated])
    useEffect(() => {
        dispatch(getGuestDetailsOptionsRequest(hotelId));
        dispatch(getGuestMoreDetailsRequest(hotelId));
        if (companyGuidBeUpdated) {
            getCompanyProfileByGuestGuid(companyGuidBeUpdated)
        }
    }, [companyGuidBeUpdated])
    return (
        <>
            <DrawerProfile
                visible={visibleNewGuestProfile}
                title={t("BOOKING.RESERVATION.guestDetailsInformation")}
                propsOnChange={onCloseGuest}
                zIndex={30}
                customFooter={
                    <div className="flex justify-between m-auto" style={{ width: 951 }}>
                        <div className={"footer-left"}>
                            <Button disabled className={`${clsx(classes.buttonFooterLeft, classes.buttonFooterLeftDisable)} flex items-center`}>
                                <div className="btn flex items-center">
                                    <PrinterOutlined className='pr-2' /> {t("BOOKING.RESERVATION.print")}
                                </div>
                            </Button>
                            <Button className={`${classes.buttonFooterLeft}`}>{t("BOOKING.RESERVATION.toIss")}</Button>
                            <Button className={`${classes.buttonFooterLeft}`}>{t("BOOKING.RESERVATION.member")}</Button>
                        </div>
                        <div className={"footer-right gap-1"}>
                            <Button className={`${classes.buttonFooterRight} !rounded-md`}
                                onClick={onCloseGuest}
                                style={{ color: "#F74352", border: "1px solid #F74352" }}>{t("BOOKING.RESERVATION.cancel")}</Button>
                            {!isDisableEdit && ((guestGuidBeUpdated !== "") ?
                                <>
                                    <Button form={changeTabs} htmlType='submit'
                                        onClick={() => setOnOkGP(true)}
                                        loading={btnLoadingGP}
                                        className={`${classes.buttonFooterRight} !rounded-md`}
                                        style={{ background: "#1A87D7", color: "white" }}>Lưu</Button>
                                    <Button className={`${classes.buttonFooterRight} !rounded-md`}
                                        onClick={handleUpdateGuestProfile}
                                        style={{ background: "#1A87D7", color: "white" }}>Hoàn tất</Button>
                                </> :
                                <>
                                    <Button form={changeTabs} htmlType='submit'
                                        onClick={() => setOnOkGP(true)}
                                        loading={btnLoadingGP}
                                        className={`${classes.buttonFooterRight} !rounded-md`}
                                        style={{ background: "#1A87D7", color: "white" }}>Thêm khách</Button>
                                    <Button className={`${classes.buttonFooterRight} !rounded-md`}
                                        onClick={handlePostListGuestProfiles}
                                        style={{ background: "#1A87D7", color: "white" }}>Hoàn tất</Button>
                                </>)
                            }
                        </div>
                    </div>
                } >
                <FormGuestProfile
                    openNewCompanyOrAgent={(e: any) => {
                        setSelectKind(e)
                        setVisibleNewCompanyProfile(true)
                    }}
                    valueForm={(data: GuestProfileFormData) => handleGuestProfile(data)}
                    getBookingByRsvnId={getBookingByRsvnId}
                    guestGuidBeUpdated={guestGuidBeUpdated}
                    onChangetabs={(key: any) => setChangeTabs(key)}
                    guestInfoByGuid={guestInfoByGuid}
                />

            </DrawerProfile>

            <DrawerProfile
                visible={visibleCompanyProfile}
                title={t("BOOKING.RESERVATION.newCompany")}
                propsOnChange={onCloseCompany}
                zIndex={100}
                customFooter={
                    <div className="flex justify-between m-auto" style={{ width: 951 }}>
                        <div className={"footer-left"} />
                        <div className={"footer-right gap-1"}>
                            <Button className={`${classes.buttonFooterRight} !rounded-md`}
                                onClick={onCloseCompany}
                                style={{ color: "#F74352", border: "1px solid #F74352" }}>{t("BOOKING.RESERVATION.cancel")}</Button>
                            <Button form={"hook-form-company"} htmlType='submit'
                                loading={btnLoadingGP}
                                className={`${classes.buttonFooterRight} !rounded-md`}
                                style={{ background: "#1A87D7", color: "white" }}
                                onClick={() => {
                                    setSubmitCompany(!submitCompany)
                                }}
                            >{t("BOOKING.RESERVATION.ok")}</Button>
                        </div>
                    </div>
                }
            >
                <CompanyAgentProfile
                    submitCompany={submitCompany}
                    visibleCompanyProfile={setVisibleNewCompanyProfile}
                    selectKind={selectKind}
                    getBookingByRsvnId={getBookingByRsvnId}
                    companyInfoByGuid={companyInfoByGuid}
                    companyGuidBeUpdated={companyGuidBeUpdated}
                    setCompanyGuidBeUpdated={setCompanyGuidBeUpdated}
                />
            </DrawerProfile>
        </>
    )
}

export default Index