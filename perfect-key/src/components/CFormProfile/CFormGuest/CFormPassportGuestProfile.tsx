/* eslint-disable @typescript-eslint/no-explicit-any*/
import React from 'react';
import { createStyles, useStyleTheme } from "theme/Theme";
import { useForm } from 'react-hook-form';
import CScrollView from 'components/CScrollView';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

export const styleFormMain = createStyles((theme) => ({
    title: {
        color: "#1A87D7",
        textTransform: 'uppercase',
        fontSize: '14px',
        fontWeight: 'bold'
    }, btn: {
        height: "40px !important",
        padding: "16px",
        marginLeft: 10,
        "& span": {
            fontWeight: "600 !important",
        }
    }
}));

const FormPassportGuestProfile = ({ valueForm, ...props }: any): JSX.Element => {
    const classes = useStyleTheme(styleFormMain);
    // const classesForm = useStyleTheme(styleCForm);
    const { t } = useTranslation("translation")
    const { handleSubmit, reset } = useForm();

    const onSubmit = handleSubmit((data) => {
        valueForm(data)
        setTimeout(() => {
            reset({})
        }, 1000);
    });

    return (
        <div className={`${props.className}`}>
            <CScrollView overlayClassScroll="custom-scrollbar-pkm">
                <div style={{ height: 'calc(100vh - 230px)', padding: "24px" }}>
                    <Button style={{ background: "#1A87D7", color: "white" }} className={`${classes.btn} !rounded-md float-right`}>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.getPassport")}</Button>
                    <form id='formPassportGuestProfile' onSubmit={onSubmit}>
                    </form>
                </div>
            </CScrollView>
        </div>
    )
};

export default React.memo(FormPassportGuestProfile);