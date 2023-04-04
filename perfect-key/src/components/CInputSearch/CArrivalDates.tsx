/* eslint-disable @typescript-eslint/no-explicit-any */
import Utils from "common/utils";
import DatePicker from "components/CDatePicker";
import { styleCForm } from "pages/main/booking/styles/styleCForm";
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useStyleTheme } from "theme";

const CArrivalDates: React.FC<Props> = ({ dateArrival, control }: any): JSX.Element => {
    const classeForm = useStyleTheme(styleCForm);
    const { t } = useTranslation("translation");
    return (
        <>
            <Controller
                name="arrivalDates"
                defaultValue={dateArrival}
                control={control} render={({ onChange, value }) => (
                    <div className="flex items-center">
                        <DatePicker
                            defaultValue={dateArrival[0]}
                            onClick={() => onChange({ ...value, isOpen: false })}
                            placeholder={t("BOOKING.from")}
                            className={classeForm.datePicker}
                            format={Utils.typeFormatDate()}
                            onChange={(date) => onChange({ ...value, from: date, isOpen: true })} />
                        <div style={{ width: "12px", padding: "0 10px" }} className="font-bold flex justify-center">  ~  </div>
                        <DatePicker
                            defaultValue={dateArrival[1]}
                            open={value?.isOpen} placeholder={t("BOOKING.to")}
                            disabledDate={(date) => (date && value?.from) && date < value?.from}
                            className={classeForm.datePicker}
                            format={Utils.typeFormatDate()}
                            onChange={(date,) => onChange({ ...value, to: date, isOpen: false })} />
                    </div>
                )} />
        </>
    );
};

export default React.memo(CArrivalDates);
