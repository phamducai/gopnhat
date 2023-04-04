/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Table } from "antd"
import { RoomInfo } from "common/model-inventory";
import { styleUnassignTable } from "components/CStyleTable";
import React, { useEffect, useState } from "react"
import { useSelectorRoot } from "redux/store";
import RoomPlanService from "services/frontdesk/roomplan.service";
import { useStyleTheme } from "theme";
import { columnsTablePMRooms } from "common/const/roomPlan.const";
import Utils from "common/utils";
import useWindowSize from "hooks/useWindowSize";

interface IPropsPMRoom {
    selectedDate: Date,
}

const PmRoom = ({ selectedDate}: IPropsPMRoom) => {
    const classesTable = useStyleTheme(styleUnassignTable);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { roomTypePm } = useSelectorRoot(state => state.booking);
    const size = useWindowSize();

    const [pageSizePM, setPageSizePM] = useState<number>(Utils.getPageSizeAssign(size));
    const [totalItemPM, setTotalItemPM] = useState<number>(1);
    const [filter, setFilter] = useState({ pageNumber: 1, pageSize: pageSizePM})
    const [pmRoom, setPmRoom] = useState<RoomInfo[]>([])
    const pmGuid: string[] = roomTypePm[0]?.guid

    useEffect(() => {
        const newPageSize = Utils.getPageSize(size);
        setPageSizePM(newPageSize);
        setFilter({ ...filter, pageSize: filter?.pageSize ?? newPageSize })
    }, [size])

    useEffect(() => {
        const listRoom = async () => {
            const dataListRoom: any[] = await RoomPlanService.getDataSourcePMRoom(hotelId, selectedDate, pmGuid)
            dataListRoom && setPmRoom(dataListRoom)
            setTotalItemPM(dataListRoom.length)
        }
        listRoom()
    }, [hotelId, roomTypePm, selectedDate, filter])

    const onPagination = (page: number) => {
        setFilter({
            ...filter,
            pageNumber: page
        })
    }
    
    return (
        <div style={{ height: '100%' }}>
            <Table
                columns={columnsTablePMRooms}
                dataSource={pmRoom}
                rowKey={'guid'}
                className={`${classesTable.table} mt-1`}
                pagination={{ hideOnSinglePage: true, total: totalItemPM, current: filter.pageNumber, pageSize: filter.pageSize, onChange: (page) => onPagination(page) }}
                size="small"
                bordered={false}
                scroll={{ x: 'calc(300px + 50%)' }}
            />
        </div>
    )
}
export default React.memo(PmRoom)