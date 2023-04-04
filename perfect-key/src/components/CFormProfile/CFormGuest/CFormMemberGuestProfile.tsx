/* eslint-disable @typescript-eslint/no-explicit-any*/
import React from 'react';
import { createStyles } from "theme/Theme";
import { useForm } from 'react-hook-form';
import CScrollView from 'components/CScrollView';

export const styleFormMain = createStyles((theme) => ({
    title: {
        color: "#1A87D7",
        textTransform: 'uppercase',
        fontSize: '14px',
        fontWeight: 'bold'
    }
}));

const FormMemberGuestProfile = ({ valueForm, ...props }: any): JSX.Element => {
    // const classes = useStyleTheme(styleFormMain);
    // const classesForm = useStyleTheme(styleCForm);
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
                <form id='formMemberGuestProfile' style={{ height: 'calc(100vh - 230px)', padding: "24px" }} onSubmit={onSubmit}>

                </form>
            </CScrollView>
        </div>
    )
};

export default React.memo(FormMemberGuestProfile);