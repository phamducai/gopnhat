/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from 'antd';
import { PropsModal } from 'common/search/TableSearchResults';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import { styleCombineGuest } from 'pages/main/booking/searchResults/styles/styleCombineGuest';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStyleTheme } from 'theme';

const { RangePicker } = DatePicker;

const ModalRoom = ({visibleModal, setIsVisible, arrivalDate, departureDate, setArrivalDate, setDepartureDate, setIsCancel,
    name, isOnlyMainGuest, setIsOnlyMainGuest,  ...props}: PropsModal) => {
    const classes = useStyleTheme(styleCombineGuest);
    const { control } = useForm();
    const {t} = useTranslation("translation")
    
    const handleChangeDatePicker= (dates: [any, any]) => {
        setArrivalDate(dates[0])
        setDepartureDate(dates[1])
    }    

    return (
        <CModel
            title={props.children}
            visible={visibleModal}
            onOk={() => setIsCancel(true)}
            onCancel={() => {
                setIsOnlyMainGuest(false)
                setIsVisible(false)
            }}
            content={
                <form>
                    <div className="col-span-10">{
                        name === "Arrival" ?
                            (<>
                                <label >{t("BOOKING.SEARCHVALUE.arrival")}:</label>
                                <label style={{ marginLeft: '18%'}}>{t("BOOKING.SEARCHVALUE.arrival")}:</label> 
                            </>)
                            :
                            (<>
                                <label >{t("BOOKING.SEARCHVALUE.departure")}:</label>
                                <label style={{ marginLeft: '18%'}}>{t("BOOKING.SEARCHVALUE.departure")}:</label> 
                            </>)}
                    <Controller
                        name="dateArrival"
                        control={control} render={({ onChange, value }) => (
                            <RangePicker className={classes.datePicker}
                                defaultValue={[arrivalDate, departureDate]}
                                style={{width: '65%'}}
                                format={Utils.typeFormatDate()}
                                onChange={(date: any) => handleChangeDatePicker(date)} 
                            />
                        )}
                    />
                    <Controller
                        name="isOnlyMainGuest"
                        control={control}
                        render={() => <Checkbox
                            defaultChecked={false}
                            style={{ color: '#00293B', marginTop: '1rem', marginLeft: '1rem' }}
                            className={`col-span-12 font-bold`}
                            onChange={() => setIsOnlyMainGuest(!isOnlyMainGuest)}>
                            {t("BOOKING.mainGuestOnly")}</Checkbox>} 
                    />
                    </div>
                </form>
            }
        />
    );
};

export default React.memo(ModalRoom);