/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Input, Table } from 'antd';
import { useStyleTheme } from "theme";
import clsx from "clsx";
import { ColumnProps } from "antd/lib/table";
import { ITableMoveFolio } from "common/cashier/model-folio";
import { IFormSearch } from "common/define-booking";
import { useSelectorRoot } from "redux/store";
import CLoading from "components/CLoading";
import CIconSvg from "components/CIconSvg";
import { IconName } from 'common/define-icon';
import { useTranslation } from "react-i18next";
import { tableStyle } from "components/CTable/style/tableStyle";

interface Props {
    height: number,
    handleSearch(formSearch: IFormSearch | any): void,
    guestGuid: string,
    setToGuestId : React.Dispatch<React.SetStateAction<string>>,
    setToTsRoomId: React.Dispatch<React.SetStateAction<string>>
    setToRoomNo: React.Dispatch<React.SetStateAction<string>>
}
const AnotherRoom = ({ height, handleSearch, guestGuid, setToGuestId, setToTsRoomId,setToRoomNo }: Props): JSX.Element => {
    const classesTable = useStyleTheme(tableStyle);
    const { reservationDataById, listGuestProfiles, queryParam, loadingSearch } = useSelectorRoot(state => state.booking);
    const { t } = useTranslation("translation");

    const [dataTable , setDataTable] = useState<ITableMoveFolio[]>([]);
    const [isSelectRow , setIsSelectRow] = useState<number>(-1);

    const typingTimeoutRef = React.useRef(0);
    
    const iconName: IconName = "blue-check"
    const columnTable: ColumnProps<ITableMoveFolio>[] = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'full Name',
            align: "left",
            width:"80%"
        },
        {
            title: '',
            dataIndex: 'guid',
            key: 'guid',
            // eslint-disable-next-line react/display-name
            render: (text, record, index) => 
                isSelectRow === index ? (<Button type="link" onClick={handleRemoveSelect}
                >
                    <CIconSvg name={iconName} svgSize="small" colorSvg={'primary'}/>
                </Button>) :
                    <Button type="link" onClick={() => handleSelectRow(index, record)}>Select</Button>
        },
    ];

    useEffect(() => {
        const data: any[] = []
        listGuestProfiles.forEach((item) => {
            const tsRoom = queryParam.find((x) => x.guestId === item.guid)
            if(item.guid !== guestGuid)
                data.push({
                    fullName: `${item.firstName ?? ""} ${item.guestName ?? ""}`, 
                    guid: item.guid,
                    parentMeGuid: tsRoom?.parentMeGuid ?? null
                })
        })
        setDataTable(data)
    },[listGuestProfiles])
    
    const handleSelectRow = (index: any, record: any) => {
        setIsSelectRow(index)
        const toTsRoomId = queryParam.find((item) => item.guestId === record.guid)
        setToGuestId(record.guid)
        toTsRoomId && setToTsRoomId(toTsRoomId?.guid)
        toTsRoomId && setToRoomNo(toTsRoomId?.transactRoomsGroup.roomName ?? "")
    }
    const handleRemoveSelect = () => {
        setIsSelectRow(-1)
        setToGuestId("")
        setToTsRoomId("")
    }

    const onSearch = (value: string) => {
        if (typingTimeoutRef.current) {
            window.clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
            const data: IFormSearch = {
                room: value ? value : "",
                isOnlyMainGuest: false,
                searchBy: "1",
                rsvn: reservationDataById.id,
                id: "",
                groupCode: "",
                phone: "",
                passport: "",
                firstName: "",
                guestName: "",
                dateArrival: undefined,
                companyAgent: "",
                dateDeparture: undefined,
                pageNumber: 1,
                pageSize: 10
            }
            handleSearch(data)
        }, 300)
    }
    useEffect(() => {
        const data: IFormSearch = {
            room: "",
            isOnlyMainGuest: false,
            searchBy: "1",
            rsvn: reservationDataById.id,
            id: "",
            groupCode: "",
            phone: "",
            passport: "",
            firstName: "",
            guestName: "",
            dateArrival: undefined,
            companyAgent: "",
            dateDeparture: undefined,
            pageNumber: 1,
            pageSize: 10
        }
        handleSearch(data)
    }, []);

    return (
        <>
            <div className="grid grid-cols-12 gap-2 mb-4">
                <div className="col-span-12">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.rsvnNo")}
                    </label>
                    <Input
                        className={`${classesTable.input}`}
                        type="text" style={{ background: "#F5F6F7", height: 40 }}
                        onChange={(e) => {
                            //setRoomNumber(e.target.value);
                            onSearch(e.target.value)
                        }} 
                    />
                </div>
            </div>
            <CLoading visible={loadingSearch}>
                <Table className={clsx(classesTable.table)} style={{ height: `calc(100vh - ${height}px)` }}
                    rowKey={"guid"}
                    locale={{emptyText:
                    <div
                        className="flex items-center justify-center"
                        style={{ height: "calc(100vh - 600px)" }}>No data</div>
                    }}
                    pagination={false}
                    columns={columnTable}
                    dataSource={dataTable}
                    scroll={{y: 500}}
                    rowClassName={(record, index: number) => {
                        const classMainGuest = record.parentMeGuid ? classesTable.trColorGuest : classesTable.trColorGuestMain;
                        const classSelectRow = isSelectRow === index ? classesTable.rowSelect : "";
                        return `${classMainGuest} ${classSelectRow}`;
                    }}
                />
            </CLoading>
        </>
    )
}
export default React.memo(AnotherRoom);