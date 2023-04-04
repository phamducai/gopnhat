/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd';
import ClassBox from 'components/CClassBox';
import { addDays } from 'date-fns';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { useStyleTheme } from 'theme'
import { styleStatistic } from './styles/styleStatistic';
import DatePicker from 'components/CDatePicker';
import { useEffect } from 'react';
import StatisticService from "services/frontdesk/statistic.service"
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { IDataArrivalsDepartures, IResArrivalsDepartures } from 'common/model-statistic';
import { listStaticGuest } from 'redux/controller';
import { styleReinstateTable } from 'components/CStyleTable';
import Auth from 'services/auth/auth.service';
import Role from 'common/roles';
import CUnAuthorzied from 'components/CUnAuthorzied';

const TableStatistic = (props: Props): JSX.Element => {
    const classes = useStyleTheme(styleStatistic);
    const classesTable = useStyleTheme(styleReinstateTable);
    const { t } = useTranslation("translation");
    const { control } = useForm();
    const [arrivalDate, setArrivalDate] = useState<Date>(addDays(new Date(), 0));
    const [dataTable, setDataTable] = useState<IDataArrivalsDepartures[]>([])
    const { hotelId } = useSelectorRoot(state => state.app);
    const dispatch = useDispatchRoot();

    const columns = [
        {
            title: '',
            dataIndex: 'name',
            className: `${classes.firstColumn}`
        },
        {
            title: t("FRONTDESK.TABLE.room"),
            className: `${classes.dataRowText}`,
            dataIndex: 'room',
        },
        {
            title: t("FRONTDESK.TABLE.guest"),
            className: `${classes.dataRowText} `,
            dataIndex: 'guest',
        },
    ];
    const formatDate = (value: any) => `${t("FRONTDESK.TABLE.businessDate")}: ${(new Intl.DateTimeFormat('en-US', {})).format(new Date())} ~ ${t("FRONTDESK.TABLE.selectedDate")}: ${(new Intl.DateTimeFormat('en-US', {})).format(value)}`

    useEffect(() => {
        const loadDataTable = async () => {
            const response: IResArrivalsDepartures = await StatisticService.getRoomAndGuestByDate(hotelId, arrivalDate);
            const dataStatistic = StatisticService.getDataStatistic(response)
            dispatch(listStaticGuest(response))
            setDataTable(dataStatistic)
        }
        loadDataTable();
        return () => {
            setDataTable([])
        }
    }, [arrivalDate, dispatch, hotelId])

    return (
        <ClassBox className={`${classes.classBox} mt-4`}>
            {Auth.hasRole(Role.FO_FOM_GM) ?
                <>
                    <div className="col-span-12 mt-7">
                        <Controller
                            name="dateArrival"
                            defaultValue=""
                            control={control} render={({ onChange, value }) => (
                                <div className={`flex items-center ${classes.customPostion}`}>
                                    <DatePicker
                                        defaultValue={arrivalDate}
                                        onClick={() => onChange({ ...value, isOpen: false })}
                                        placeholder={t("FRONTDESK.TABLE.businessDate") + " ~ " + t("FRONTDESK.TABLE.selectedDate")}
                                        className={classes.datePicker}
                                        format={formatDate}
                                        onChange={(date: any) => {
                                            setArrivalDate(date)
                                            onChange({ ...value, from: date, isOpen: true, })
                                        }
                                        }
                                    />
                                    <div className={classes.datePickerFakeInput}>
                                        {t("FRONTDESK.TABLE.businessDate")}: <b>{(new Intl.DateTimeFormat('en-US', {})).format(new Date())}</b>  ~ {t("FRONTDESK.TABLE.selectedDate")}: <b>{(new Intl.DateTimeFormat('en-US', {})).format(arrivalDate)}</b>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    <div>
                        <Table
                            columns={columns}
                            dataSource={dataTable}
                            className={`${classesTable.table} mt-3`}
                            pagination={false}
                            size="small"
                            bordered={false}
                            scroll={{ y: 500 }}
                        />
                    </div>
                </>
                : <CUnAuthorzied />}

        </ClassBox>
    )
}
export default React.memo(TableStatistic)