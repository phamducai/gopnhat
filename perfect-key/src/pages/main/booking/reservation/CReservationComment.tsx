import ClassBox from 'components/CClassBox'
import React from 'react'
import { Input } from 'antd';
import clsx from 'clsx';
import { createStyles, useStyleTheme } from 'theme';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelectorRoot } from 'redux/store';
import { useParams } from 'react-router';
const styleReservationComment = createStyles((theme) => ({
    textArea: {
        "& textarea.ant-input":
        {
            height: "100%",
            borderRadius: 6,
            backgroundColor: "#F5F6F7",
        }
    }
}));
interface idRsvn {
    idRsvn: string
}

// eslint-disable-next-line
export default function CReservationComment(props: any): JSX.Element {
    const { TextArea } = Input;
    const { control } = props;
    const { getBookingByRsvnId } = useSelectorRoot(state => state?.rsvn);
    const id: idRsvn = useParams();
    const classes = useStyleTheme(styleReservationComment);
    const { t } = useTranslation("translation")
    return (
        <ClassBox className={clsx(props.className)}>
            <div className={`grid grid-cols-12 pt-4 h-full`} style={{ paddingLeft: 1.5, paddingRight: 1.5 }}>
                <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.comments")}:</p>
                <Controller as={<TextArea className={`${classes.textArea} w-full col-span-12`} style={{ height: 140, backgroundColor: "#F5F6F7", borderRadius: 6 }} placeholder="Input comment here" />}
                    name="comments" defaultValue={id.idRsvn ? getBookingByRsvnId.dataForeservationDTO.comments : "" } control={control} />
            </div>
        </ClassBox>
    )
}
