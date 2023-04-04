/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import clsx from 'clsx';
import CIconSvg from 'components/CIconSvg';
import { styleReservation } from 'components/CModal';
import { styleCTable } from 'components/CStyleTable';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, {  useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useStyleTheme } from 'theme';
import { PrinterOutlined } from '@ant-design/icons';
import { IGetTraceInHouse } from 'common/model-common';
import ReservationService from 'services/reservation/reservation.service.';
import Utils from 'common/utils';
import CLoading from 'components/CLoading';

interface PropsServiceModal {
    isShowModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    tsRoomId: number
}
const CModalTraceInHouse = ({isShowModal, setShowModal, tsRoomId} : PropsServiceModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const classesModal = useStyleTheme(styleReservation);
    const classesTable = useStyleTheme(styleCTable);
    const { t } = useTranslation("translation");

    const [listTraceInHouse, setListTraceInHouse] = useState<IGetTraceInHouse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAPI = async () => {
            const resp = await ReservationService.getListTraceInHouseByTsRoomId(tsRoomId)
            setListTraceInHouse(resp);
            setIsLoading(false);
        }
        fetchAPI();
    },[tsRoomId])

    const columnTable: ColumnProps<IGetTraceInHouse[]>[] = [
        {
            title: 'Object ID',
            dataIndex: 'id',
            key: 'id',
            width: '20%',
            className: "text-center",
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
            width: '20%',
            className: "text-center",
        },
        {
            title: 'Action Name',
            dataIndex: 'actionName',
            key: 'actionName',
            width: '30%',
            className: "text-center",
        },
        {
            title: 'Date',
            dataIndex: 'tgtn',
            key: 'tgtn',
            render: (value, record: any, index: number) => (
                Utils.convertToVNTimeZoneMbyMoment(value)
            ),
            width: '20%',
            className: "text-center",
        },
        {
            title: 'Old Value',
            dataIndex: 'oldString',
            key: 'oldString',
            width: '30%',
            className: "text-center",
        },
        {
            title: 'New Value',
            dataIndex: 'newString',
            key: 'newString',
            width: '30%',
            className: "text-center",
        }
    ];
    return (
        <Modal
            title={<span className={`${classes.titleStyle}`}>Trace Actions - ID: {tsRoomId}</span>}
            visible={isShowModal}
            destroyOnClose={true}
            className={clsx(classesModal.antModalStyle)}
            closeIcon={<CIconSvg name="close-drawer" hexColor="#F74352" svgSize="default" onClick={() => setShowModal(false)} />}
            width={"80%"}
            footer={
                <div className="">
                    <Button disabled className={`${classes.buttonFooterLeft} ${classes.buttonFooterLeftDisable} flex items-center`}><div className="btn flex items-center">
                        <PrinterOutlined className='pr-2' /> Print</div>
                    </Button>
                    <Button
                        style={{ color: "#F74352", border: "1px solid #F74352" }}
                        className={`!rounded-md ${classes.buttonStyle}`}
                        onClick={() => setShowModal(false)}
                    >
                        {t("BOOKING.RESERVATION.EDITRESERVATION.close")}
                    </Button >
                </div >
            }
        >
            <CLoading visible={isLoading}>
                <div className='grid-cols-12 grid'>
                    <div className="col-span-12" style={{ height: "calc(100vh - 434px)"}}>
                        <Table className={clsx(classesTable.table)}
                            locale={{
                                emptyText:
                                    <div
                                        className="flex items-center justify-center"
                                        style={{ height: "calc(100vh - 450px)" }}>No data</div>
                            }}
                            pagination={false}
                            columns={columnTable}
                            rowKey={"id"}
                            bordered 
                            dataSource={Object.assign([], listTraceInHouse)}
                            scroll={{ x: 600, y: 500 }}
                        />
                    </div>
                </div>
            </CLoading>

        </Modal >
    );
}
export default React.memo(CModalTraceInHouse);