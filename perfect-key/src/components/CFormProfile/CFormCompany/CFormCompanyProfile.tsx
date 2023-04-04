/* eslint-disable */
import ClassBox from 'components/CClassBox';
import React, { useEffect, useRef, useState } from 'react';
import { useStyleTheme } from "theme/Theme";
import { Tabs, Modal, Alert } from 'antd';
import { styleCTabs } from 'components/CStyleTabs';
import FormMainCompanyProfile from './CFormMainCompanyProfile';
import FormMoreCompanyProfile from './CFormMoreCompanyProfile';
import { Controller, useForm } from 'react-hook-form';
import CompanyProfileData from "common/const/profileDefaultValue";
import { CompanyProfile } from "common/model-profile";
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { addCompanyProfileRequest, getCompanyMoreDetailsRequest } from "redux/controller/company.slice";
import CompanyService from 'services/booking/company.service';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { TabPane } = Tabs;
function CompanyAgentProfile({ valueForm, ...props }: any): JSX.Element {
    const history = useHistory();
    let dataForm: any = { ...CompanyProfileData };
    const { hotelId } = useSelectorRoot(state => state.app);

    const dispatch = useDispatchRoot()
    const classesTabs = useStyleTheme(styleCTabs);
    const { submitCompany, visibleCompanyProfile, selectKind, getBookingByRsvnId, companyInfoByGuid, companyGuidBeUpdated, setCompanyGuidBeUpdated } = props;
    const { handleSubmit, control, setValue, getValues, reset } = useForm();
    const { t } = useTranslation("translation")

    const updateCompanyProfile = async (data: CompanyProfile) => {
        if (companyGuidBeUpdated) {
            await CompanyService.editCompanyProfile(data, companyGuidBeUpdated)
        }
    }
    const onSubmit = handleSubmit((data: any) => {
        const key = Object.keys(data);
        key.map((item: any) => {
            dataForm[item] = data[item]
        })
        dataForm.namThanhLap = dataForm.namThanhLap === null || dataForm.namThanhLap === "" ? null : dataForm.namThanhLap + "-01-01";
        if (companyInfoByGuid == null) {
            dispatch(addCompanyProfileRequest({
                hotelGuid: hotelId,
                input: dataForm.ten,
                data: dataForm
            }))
        } else {
            updateCompanyProfile(dataForm)
            setCompanyGuidBeUpdated("")
        }
        dataForm = { ...CompanyProfileData };
        visibleCompanyProfile(false)
    });
    useEffect(() => {
        dispatch(getCompanyMoreDetailsRequest(hotelId))
    }, [])
    useEffect(() => {
        const defaultValueCompanyAgent = selectKind !== "null" ? selectKind : undefined;
        setValue("kind", defaultValueCompanyAgent);
        if (companyInfoByGuid !== null) {
            const dataForm: any = Object.assign({}, companyInfoByGuid);
            for (const key of Object.keys(dataForm)) {
                if (dataForm[key] !== null || dataForm[key] !== "0") {
                    setValue(key, dataForm[key]);
                }
            }
        } else {
            reset({})
        }
    }, [selectKind, companyInfoByGuid]);

    return (
        <form onSubmit={onSubmit} id="hook-form-company" className="h-full">
            <Tabs className={`${classesTabs.customTabs} flex justify-center h-full`} defaultActiveKey="1" centered>
                <TabPane tab={t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.main")} key="companyMain">
                    <ClassBox className={classesTabs.customClassBox}>
                        <FormMainCompanyProfile
                            control={control}
                            getValues={getValues}
                            companyInfoByGuid={companyInfoByGuid}
                        />
                    </ClassBox>
                </TabPane>
                <TabPane tab={t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.more")} key="companyMore">
                    <ClassBox className={classesTabs.customClassBox}>
                        <FormMoreCompanyProfile
                            control={control}
                            companyInfoByGuid={companyInfoByGuid}
                        />
                    </ClassBox>
                </TabPane>
            </Tabs>
        </form>
    )
};

export default React.memo(CompanyAgentProfile);