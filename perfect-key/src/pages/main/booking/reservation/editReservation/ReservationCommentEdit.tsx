/* eslint-disable @typescript-eslint/no-explicit-any */
import ClassBox from 'components/CClassBox'
import React from 'react'
import { Input } from 'antd';
import { createStyles, useStyleTheme } from 'theme';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataCEditRsvn } from 'common/model-rsvn';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { setTraceInHouse } from 'redux/controller/trace.slice';
import { TypeActionCode } from 'common/enum/tracer.enum';
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
interface Props{
    control?: any,
    dataEditRsvn?: DataCEditRsvn | null
}
export default function CReservationCommentEdit({control, dataEditRsvn}: Props): JSX.Element {
    const { TextArea } = Input;
    const dispatch = useDispatchRoot();
    const {hotelId} = useSelectorRoot(state => state.app);
    const classes = useStyleTheme(styleReservationComment);
    const { t } = useTranslation("translation")

    const traceChange = (actionCode: number, oldValue: string, newValue: string) => {
        dispatch(setTraceInHouse({
            actionCode : actionCode,
            objectId: dataEditRsvn?.dataFotransactRoomDTO.id ?? 0,
            oldString: oldValue,
            newString: newValue,
            oldDate: new Date(dataEditRsvn?.dataFotransactRoomDTO.arrivalDate ?? "") ?? new Date(),
            newDate: new Date(),
            hotelGuid: hotelId
        }))
    }
    return (
        <ClassBox key={"comment-edit-key"}>
            <div className={`grid grid-cols-12 pt-4 h-full`} style = {{paddingLeft : 1.5, paddingRight : 1.5}}>
                <label className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.comments")}:</label>
                <Controller 
                    render={({ onChange, value }) =>
                        <TextArea 
                            className={`${classes.textArea} w-full col-span-12`} 
                            style={{ height: 140, backgroundColor: "#F5F6F7", borderRadius : 6 }} 
                            placeholder="Input comment here" 
                            value={value}
                            onChange={(e) => {
                                onChange(e.target.value)
                                traceChange(TypeActionCode.ChangeComment, value, e.target.value)
                            }}
                        />
                    }
                    name="comments" defaultValue="" control={control} />
            </div>
        </ClassBox>
    )
}
