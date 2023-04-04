/* eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useEffect, useState } from 'react';
import { createStyles, ThemeDefine, useStyleTheme } from 'theme';
import { Button, Tabs } from 'antd';
import { styleCTabs } from 'components/CStyleTabs';
import FormMainGuestProfile from './CFormMainGuestProfile';
import FormMoreGuestProfile from './CFormMoreGuestProfile';
import FormMemberGuestProfile from './CFormMemberGuestProfile';
import FormPassportGuestProfile from './CFormPassportGuestProfile';
import usePrevious from 'hooks/usePrevious';
import { useHistory } from 'react-router-dom';
import GuestProfileService from 'services/booking/guestprofile.service';
import { GuestProfile } from 'common/model-profile';
import { useTranslation } from 'react-i18next';
//import ProfilesService from 'services/booking/profilesNoRsvn/profiles.service';
import { GuestProfileNoRsvn } from "common/model-profile";
const { TabPane } = Tabs;

export const styleFormMain = createStyles((theme: ThemeDefine) => ({
    main: {
        background: '#FFFFFF',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px'
    }
}));

interface IFormGuestProfile extends Props {
    onChangetabs: any,
    valueForm: any,
    onSearchFirstName?: any,
    openNewCompanyOrAgent: any,
    getBookingByRsvnId: any
    walkInProfile?: GuestProfile | null
    guestGuidBeUpdated?: string
    guestInfoByGuid?: GuestProfileNoRsvn | null
}

const Index = ({ onChangetabs, valueForm, onSearchFirstName, openNewCompanyOrAgent, getBookingByRsvnId, walkInProfile, guestGuidBeUpdated, guestInfoByGuid, ...props }: IFormGuestProfile): JSX.Element => {
    const history = useHistory();
    const classesTabs = useStyleTheme(styleCTabs);
    const classes = useStyleTheme(styleFormMain);
    const [formData, setFormData] = useState({ main: {}, more: {}, passport: {}, memberInfo: {} })
    const [nameTabs, setNameTabs] = useState('formMainGuestProfile')
    const [valueGuestProfile, setValueGuestProfile] = useState<GuestProfile | null>();
    const prevTabs = usePrevious(nameTabs)
    const { t } = useTranslation("translation")
    const mapValueInput = async () => {
        const res = await GuestProfileService.getGuestProfileByGuid(getBookingByRsvnId.dataFotransactRoomDTO.guestId);
        res ? setValueGuestProfile(res) : setValueGuestProfile(null);
    }
    useEffect(() => {
        onChangetabs('formMainGuestProfile')
        if (history.location.state && getBookingByRsvnId) {
            const historyState: any = history.location.state;
            if (historyState.isAddRSVN) {
                mapValueInput();
            }
        }
    }, [])//eslint-disable-line

    useEffect(() => {
        if (walkInProfile) {
            setValueGuestProfile(walkInProfile)
        }
    }, [walkInProfile])
    const valueFormMainGuestProfile = (data: any) => {
        setFormData({ ...formData, main: data })
        valueForm({ ...formData, main: data });
    }
    const valueFormMoreGuestProfile = (data: any) => {
        setFormData({ ...formData, more: data })
        valueForm({ ...formData, more: data });
    }
    const valueFormPassportGuestProfile = (data: any) => {
        setFormData({ ...formData, passport: data })
        valueForm({ ...formData, passport: data });
    }
    const valueFormMemberGuestProfile = (data: any) => {
        setFormData({ ...formData, memberInfo: data })
        valueForm({ ...formData, memberInfo: data });
    }

    return (
        <Tabs onChange={(key) => { setNameTabs(key); onChangetabs(key) }} className={`${classesTabs.customTabs} h-full flex justify-center`} defaultActiveKey="formMainGuestProfile" centered>
            <TabPane tab={<Button form={prevTabs} type="text">{t("BOOKING.RESERVATION.FORMGUESTPROFILE.main")}</Button>} key="formMainGuestProfile">
                <FormMainGuestProfile
                    openNewCompanyOrAgent={(e: string) => openNewCompanyOrAgent(e)}
                    onSearchFirstName={(e: string) => onSearchFirstName(e)}
                    valueForm={valueFormMainGuestProfile}
                    className={`${classes.main}`}
                    valueGuestProfile={valueGuestProfile}
                    guestInfoByGuid={guestInfoByGuid}
                />
            </TabPane>
            <TabPane tab={<Button form={prevTabs} type="text">{t("BOOKING.RESERVATION.FORMGUESTPROFILE.more")}</Button>} key="formMoreGuestProfile">
                <FormMoreGuestProfile
                    valueForm={valueFormMoreGuestProfile}
                    className={`${classes.main}`}
                    valueGuestProfile={valueGuestProfile}
                    guestInfoByGuid={guestInfoByGuid}
                />
            </TabPane>
            <TabPane tab={<Button form={prevTabs} type="text">{t("BOOKING.RESERVATION.FORMGUESTPROFILE.passport")}</Button>} key="formPassportGuestProfile">
                <FormPassportGuestProfile
                    valueForm={valueFormPassportGuestProfile}
                    className={`${classes.main}`}
                />
            </TabPane>
            <TabPane tab={<Button form={prevTabs} type="text">{t("BOOKING.RESERVATION.FORMGUESTPROFILE.memberInfo")}</Button>} key="formMemberGuestProfile">
                <FormMemberGuestProfile
                    valueForm={valueFormMemberGuestProfile}
                    className={`${classes.main}`}
                />
            </TabPane>
        </Tabs>
    )
}

const FormGuestProfile = React.memo(Index);
export default FormGuestProfile