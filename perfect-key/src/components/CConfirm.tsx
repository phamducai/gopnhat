/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Checkbox } from 'antd';
import { Controller, useForm } from "react-hook-form";
import { ReservationStatus } from "common/enum/booking.enum";
import { DataFormConfirm } from "common/model-booking";
interface PropsConfirm{
    title: string,
    propsGetData: any,
    defaultValue: boolean,
    idForm: string,
    status: number
}

const CConfirm = ({title, defaultValue, propsGetData, idForm, status}: PropsConfirm) => {
    const { handleSubmit, control } = useForm();
    const onSubmit = handleSubmit((data: DataFormConfirm) => {
        propsGetData(data)
        
    })
    return(
        <form onSubmit={onSubmit} id={idForm}>
            <Controller
                control={control}
                defaultValue={defaultValue}
                name="isChild"
                render={({ onChange }) => (
                    <Checkbox
                        style={{ marginLeft: "0.5rem", display: `${status === ReservationStatus.CheckIn ? "flex" : "none"}` }}
                        defaultChecked={defaultValue}
                        onChange={(e) => onChange(e.target.checked)}
                    >
                        {title}
                    </Checkbox>
                )}
            />
        </form>
    )
}
export default React.memo(CConfirm);