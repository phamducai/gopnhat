/* eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useState } from 'react';
import { createStyles, useStyleTheme } from "theme/Theme";
import DatePicker from './CDatePicker';
import Utils from 'common/utils';

export const styleCRangePicker = createStyles((theme) => ({
    datePicker: {
        "&.ant-picker": {
            padding: "0px !important",
            borderRadius: "6px",
            width: "193px ",
            height: "38px",

        },
        "& .ant-picker-input": {
            background: "#F5F6F7",
            width: "191px !important",
            height: "36px !important",
            padding: "0 10px",
            borderRadius: "6px"
        },
        "& .ant-picker-suffix": {
            color: "#1A87D7",
            display: "flex",
            alightItems: "center"
        },
        "& .ant-picker-active-bar": {
            bottom: "0px !important",
            marginLeft: "0px !important"
        },
        "& .ant-picker-range-separator": {
            padding: "0px"
        },
        "&.ant-picker-focused": {
            borderColor: "#d9d9d9",
            boxShadow: "none"
        }
    },
}));

export interface ICRangePicker extends Props {
    dataDate?: {
        fromDate: Date,
        toDate: Date
    },
    setDate?: any,
}

const CRangePicker = ({ dataDate, setDate, ...props }: ICRangePicker): JSX.Element => {
    const classes = useStyleTheme(styleCRangePicker)
    const [isOpenTo, setOpenTo] = useState(false)
    const [dateRangePicker, setDateRangePicker] = useState<any>({})

    React.useEffect(() => {
        dataDate && setDateRangePicker({ from: dataDate?.fromDate, to: dataDate?.toDate })
    }, [dataDate])

    const onChangeFrom = (fromDate: Date | null) => {
        setOpenTo(true)
        fromDate && setDateRangePicker({ to: '', from: fromDate })
    }
    const onChangeTo = (toDate: Date | null) => {
        setOpenTo(false)
        toDate && setDateRangePicker({ ...dateRangePicker, to: toDate })
        setDate({ ...dateRangePicker, to: toDate })
    }
    return (
        <div className={`${props.className} flex items-center`}>
            <DatePicker
                value={dateRangePicker?.from}
                onClick={() => setOpenTo(false)}
                onChange={onChangeFrom}
                format={Utils.typeFormatDate()}
                clearIcon
                placeholder="From"
                className={`${classes.datePicker} h-full w-full`}
            />
            <div style={{ maxWidth: "8px", padding: "0 6px" }} className="font-bold flex justify-center px-1">~</div>
            <DatePicker
                value={dateRangePicker?.to}
                onClick={() => setOpenTo(true)}
                onBlur={() => setOpenTo(false)}
                open={isOpenTo}
                disabledDate={(date: Date) => (date && dateRangePicker?.from) && date < dateRangePicker?.from}
                onChange={onChangeTo}
                format={Utils.typeFormatDate()}
                clearIcon
                placeholder="To"
                className={`${classes.datePicker} h-full w-full`}
            />
        </div>
    )
};

export default React.memo(CRangePicker);