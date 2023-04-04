/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerProfile from "components/CDrawerProfile/CDrawerProfile";
import FormGuestProfile from "components/CFormProfile/CFormGuest/CFormGuestProfile";
import { GuestProfileFormData } from "common/const/guestProfileFormData";
import GUEST_PROFILE_DEFAULT_VALUE from "common/const/guestProfileDefaultValue";
import { guestProfileInBookingRSVN, searchRequest } from "redux/controller";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { getGuestDetailsOptionsRequest, getGuestMoreDetailsRequest } from "redux/controller/reservation.slice";
import clsx from 'clsx';
import { styleEditReservation } from 'pages/main/booking/reservation/editReservation/styles/index.style';
import { useStyleTheme } from "theme";
import { PrinterOutlined } from '@ant-design/icons';
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import CompanyAgentProfile from 'components/CFormProfile/CFormCompany/CFormCompanyProfile';

interface Props{
    visibleGuestProfile: boolean,
    visibleCompanyProfile: boolean,
    setVisibleGuestProfile: React.Dispatch<React.SetStateAction<boolean>>,
    setVisibleCompanyProfile: React.Dispatch<React.SetStateAction<boolean>>
}

const CHandleProfileAndCompany = ({ visibleGuestProfile, visibleCompanyProfile, setVisibleGuestProfile, setVisibleCompanyProfile }: Props): JSX.Element => {
    const history = useHistory();
    const classes = useStyleTheme(styleEditReservation);
    const { t } = useTranslation("translation");
    const dispatch = useDispatchRoot();

    const { hotelId, numberOfRooms } = useSelectorRoot(state => state.app);

    const [btnLoadingGP, setBtnLoadingGP] = useState<boolean>(false);
    const [onOkGP, setOnOkGP] = useState<boolean>(false)
    const [changeTabs, setChangeTabs] = useState<string>("");
    const [selectKind, setSelectKind] = useState<any>('')
    const [submitCompany, setSubmitCompany] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getGuestDetailsOptionsRequest(hotelId));
        dispatch(getGuestMoreDetailsRequest(hotelId));
        return () => {
            dispatch(guestProfileInBookingRSVN(GUEST_PROFILE_DEFAULT_VALUE));
        }
    },[dispatch, hotelId])

    const handleGuestProfile = (formData: GuestProfileFormData) => {
        //setProfileFormData(formData);
        const pre = { ...GUEST_PROFILE_DEFAULT_VALUE };
        transformData(formData.main, pre);
        transformData(formData.more, pre);
        dispatch(guestProfileInBookingRSVN(pre));
        setVisibleGuestProfile(false)
        if (onOkGP) {
            setBtnLoadingGP(true)
            setTimeout(() => {
                setBtnLoadingGP(false)
                setOnOkGP(false)
            }, 200);
        }
    }
    const transformData = (obj: any, destination: any) => {
        Object?.keys(destination)?.map(key => {
            if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined)
                destination[key] = obj[key];
            return null;
        });
    }
    //Handle search first name
    const handleSearchFirstName = (e: { firstName: string, searchBy: number }) => {
        history.push(`/main/booking/search`, {
            firstName: e.firstName,
            searchBy: e.searchBy
        })
        const data = {
            hotelGuid: hotelId,
            status: e.searchBy,
            profiles: {
                phone: '',
                passport: '',
                firstName: e.firstName,
                guestName: ''
            },
            listRoomType: numberOfRooms
        }
        dispatch(searchRequest(data))
    }
    return (
        <React.Fragment>
            <DrawerProfile
                visible={visibleGuestProfile}
                title={t("BOOKING.RESERVATION.guestDetailsInformation")}
                propsOnChange={() => setVisibleGuestProfile(false)}
                zIndex={30}
                customFooter={
                    <div className="flex justify-between m-auto" style={{ width: 951 }}>
                        <div className={"footer-left"}>
                            <Button disabled className={`${clsx(classes.buttonFooterLeft, classes.buttonFooterLeftDisable)} flex items-center`}><div className="btn flex items-center"><PrinterOutlined className='pr-2' /> Print</div></Button>
                            <Button className={`${classes.buttonFooterLeft}`}>{t("BOOKING.RESERVATION.toIss")}</Button>
                            <Button className={`${classes.buttonFooterLeft}`}>{t("BOOKING.RESERVATION.member")}</Button>
                        </div>
                        <div className={"footer-right gap-1"}>
                            <Button className={`${classes.buttonFooterRight} !rounded-md`}
                                onClick={() => setVisibleGuestProfile(false)}
                                style={{ color: "#F74352", border: "1px solid #F74352" }}>{t("BOOKING.RESERVATION.cancel")}</Button>
                            <Button form={changeTabs} htmlType='submit'
                                onClick={() => setOnOkGP(true)}
                                loading={btnLoadingGP}
                                className={`${classes.buttonFooterRight} !rounded-md`}
                                style={{ background: "#1A87D7", color: "white" }}>{t("BOOKING.RESERVATION.ok")}</Button>
                        </div>
                    </div>
                } >
                <FormGuestProfile
                    openNewCompanyOrAgent={(e: any) => {
                        setSelectKind(e)
                        setVisibleCompanyProfile(true)
                    }}
                    onSearchFirstName={(e: string) => handleSearchFirstName({ firstName: e, searchBy: 5 })}
                    valueForm={(data: GuestProfileFormData) => handleGuestProfile(data)}
                    getBookingByRsvnId={null}
                    onChangetabs={(key: any) => setChangeTabs(key)}/>

            </DrawerProfile>
            <DrawerProfile visible={visibleCompanyProfile} title={t("BOOKING.RESERVATION.newCompany")} propsOnChange={() => setVisibleCompanyProfile(false)} zIndex={100}
                customFooter={
                    <div className="flex justify-between m-auto" style={{ width: 951 }}>
                        <div className={"footer-left"} />
                        `       <div className={"footer-right gap-1"}>
                            <Button className={`${classes.buttonFooterRight} !rounded-md`}
                                onClick={() => setVisibleCompanyProfile(false)}
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
                    visibleCompanyProfile={setVisibleCompanyProfile}
                    selectKind={selectKind}
                />
            </DrawerProfile>
        </React.Fragment>
    )
}

export default CHandleProfileAndCompany;