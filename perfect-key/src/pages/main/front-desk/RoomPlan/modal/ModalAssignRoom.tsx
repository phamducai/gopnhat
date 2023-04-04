/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Select, Modal, Divider, Table, Input, Checkbox } from 'antd';
import CModel from 'components/CModal';
import { useStyleTheme } from 'theme'
import { SelectedGuestProfile } from "common/define-api-booking";
import { RoomInfo } from "common/model-inventory";
import { styleCombineGuest } from 'pages/main/booking/searchResults/styles/styleCombineGuest';
import { useTranslation } from 'react-i18next';
import RoomPlanService from "services/frontdesk/roomplan.service";
import { useSelectorRoot } from 'redux/store';
import { AssignRoom } from 'common/model-rsvn';
import { ColumnsType } from "antd/lib/table";
import Utils from 'common/utils';
import CLoading from 'components/CLoading';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import { Space } from 'antd';
import { styleReinstateTable } from 'components/CStyleTable';
import { ListCardRoomPlan } from 'common/model-inventory';

const { Search } = Input;
const { Option } = Select;

interface Props {
    isVisible: boolean,
    setIsVisble: React.Dispatch<React.SetStateAction<boolean>>,
    dataSelected: SelectedGuestProfile[],
    getData?: any,
    searchAndMapData?: any,
    isInRoomPlan: boolean
}

const ModalAssignRoom = ({ isVisible, setIsVisble, getData, searchAndMapData, dataSelected, isInRoomPlan }: Props) => {
    const classesTable = useStyleTheme(styleReinstateTable);
    const classes = useStyleTheme(styleCombineGuest);
    const { roomType } = useSelectorRoot(state => state.booking)
    const { hotelId } = useSelectorRoot(state => state.app)
    const [selectedRoomType, setSelectedRoomType] = useState<string | undefined>(dataSelected[0].roomType);
    const [listRooms, setListRooms] = useState<any[] | []>([]);
    const [dataProject, setDataProject] = useState<any[] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [assignData, setAssignData] = useState<AssignRoom[] | []>([]);
    const [doNotMove, setDoNotMove] = useState<boolean>(false);
    const [inputRoom, setInputRoom] = useState<string>("");
    const { t } = useTranslation("translation")

    const columns: ColumnsType<any> = [
        {
            title: 'Room',
            dataIndex: 'so',
            width: "30%",
        },
        {
            title: 'Room Type',
            dataIndex: 'roomType',
            width: "40%",
        },
        {
            title: 'Status',
            dataIndex: 'tinhTrang',
            width: "30%",
        },
    ];
    const fetchRooms = async (roomTypeGuid: string | undefined) => {
        if (roomTypeGuid) {
            setLoading(true);
            let arrivalDate = "";
            let departureDate = "";
            let data: any[] = [];
            dataSelected.forEach((data, index) => {
                if (index === 0) {
                    arrivalDate = data.arrivalDate;
                    departureDate = data.departureDate;
                }
                if (Utils.formatDateString(data.arrivalDate) < Utils.formatDateString(arrivalDate)) {
                    arrivalDate = data.arrivalDate;
                }
                if (Utils.formatDateString(departureDate) < Utils.formatDateString(data.departureDate)) {
                    departureDate = data.departureDate;
                }
            });

            const getStatus = (tinhTrang: number) => {
                switch (tinhTrang) {
                    case null:
                        return "OK";
                    case 1:
                        return "OK";
                    case 3:
                        return "OOO";
                    case 4:
                        return "OOS";
                    default:
                        break;
                }
            }
            const getDirty = (dirtyStatus: number) => {
                switch (dirtyStatus) {
                    case 0:
                        return "DIRTY";
                    case 1:
                        return "OK";
                    default:
                        break;
                }
            }
            const dataRooms = await RoomPlanService.getAvailableRooms(hotelId, roomTypeGuid, arrivalDate, departureDate);
            dataRooms.map((room: RoomInfo) => {
                const tmp = roomType.find(x => x.guid === room.loai);
                if (tmp)
                    data.push({ ...room, roomType: tmp.ten, loai: tmp.guid, tinhTrang: `${getStatus(room.tinhTrang)} - ${getDirty(room.cleanDirty)}`, })
            })
            setListRooms(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isVisible) {
            fetchRooms(selectedRoomType)
        }
    }, [isVisible, selectedRoomType])

    const pushAssignData = (guest: SelectedGuestProfile, room: RoomInfo) => {
        let data: AssignRoom[] = [...assignData];
        const assignRoom: AssignRoom = {
            trsGuid: guest.guid,
            roomGuid: room.guid,
            roomName: room.so,
            roomType: room.loai
        }
        data.push(assignRoom);
        setAssignData(data);
    }

    const showConfirm = (title: string, guest: SelectedGuestProfile, room: RoomInfo) => {
        Modal.confirm({
            title: title,
            okText: t("FRONTDESK.ROOMPLAN.yes"),
            cancelText: t("FRONTDESK.ROOMPLAN.no"),
            onOk() {
                pushAssignData(guest, room);
            },
            className: "custom-modal-confirm-pkm"
        });
    }
    const checkRoomCondition = async (guest: SelectedGuestProfile, room: any) => {
        if (assignData.find(x => x.roomGuid === room.guid)) {
            return;
        }
        const _room = listRooms.find(item => item.guid === room.guid);
        if (_room) {
            if (_room.loai === guest.roomType) {
                if (_room.cleanDirty === 1 && _room.tinhTrang === "OK - OK") {
                    pushAssignData(guest, _room);
                }
                if (_room.cleanDirty === 0 && _room.tinhTrang === "OOS - DIRTY")
                    showConfirm(t("FRONTDESK.ROOMPLAN.assignDirtyAndOOS"), guest, _room)
                if (_room.tinhTrang === "OOS - OK")
                    showConfirm(t("FRONTDESK.ROOMPLAN.assignOOSRoom"), guest, _room)
                if (_room.cleanDirty === 0)
                    showConfirm(t("FRONTDESK.ROOMPLAN.assignDirtyRoom"), guest, _room)
            }
            else {
                showConfirm(`${t("FRONTDESK.ROOMPLAN.wantToChange")} ${guest.roomName} ${t("FRONTDESK.ROOMPLAN.roomTo")} ${room.roomType} ${t("FRONTDESK.ROOMPLAN.fromRoom")}`, guest, _room)
            }
        }
    }

    const handelOk = async () => {
        if (assignData.length === dataSelected.length) {
            sendRequestAssign();
            if (doNotMove)
                sendRequestUpdate();
        }
        else {
            openNotification(NotificationStatus.Error, t("FRONTDESK.ROOMPLAN.error"), "Wrong number of rooms for assign rooms!")
        }
    }
    const sendRequestUpdate = async () => {
        let data: any[] = [];
        assignData.map((dt: any) => data.push({ guid: dt.trsGuid }));
        await RoomPlanService.updateDoNotMove(data, true);
    }
    const sendRequestAssign = async () => {
        const assignRes = await RoomPlanService.assignRoom(assignData);
        if (assignRes.result) {
            openNotification(NotificationStatus.Success, t("FRONTDESK.ROOMPLAN.success"), t("FRONTDESK.ROOMPLAN.AssignSuccess"))
            setIsVisble(false);
            setAssignData([]);
            getData();
            isInRoomPlan && searchAndMapData();
        } else {
            setIsVisble(false);
            setAssignData([]);
        }
    }

    const onSearch = React.useCallback(
        (value: string) => {
            setTimeout(() => {
                setLoading(true);
                if (value !== "") {
                    setInputRoom(value);
                    const newData = listRooms?.filter(items => items.so.toLowerCase().includes(value.toLowerCase()));
                    setDataProject(newData);
                }
                else fetchRooms(selectedRoomType)
                setLoading(false);
            }, 400);
        },
        [inputRoom]
    );

    React.useEffect(() => {
        setDataProject(listRooms);
    }, [listRooms]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(true);
            onSearch(inputRoom);
        }, 500);
        return () => clearTimeout(timeout);
    }, [inputRoom]);

    return (
        <CModel
            title={t("FRONTDESK.ROOMPLAN.assignRoom")}
            visible={isVisible}
            onOk={() => handelOk()}
            onCancel={() => {
                setIsVisble(false);
            }}
            style={{ top: '3%' }}
            content={
                <form>
                    <Space className="grid grid-cols-3">
                        <div>
                            Room:
                        </div>
                        <div>
                            <Search
                                onSearch={(value: string) => setInputRoom(value)}
                                onChange={(e: any) => setInputRoom(e.target.value)}
                            />
                        </div>
                        <div>
                            <Checkbox onChange={(e) => setDoNotMove(e.target.checked)} >Do not Move</Checkbox>
                        </div>
                    </Space>

                    <div className="col-span-6 mt-2">
                        <Select
                            showSearch
                            defaultValue={dataSelected[0].roomType}
                            className={`${classes.selectBackground} w-full !rounded-md`}
                            value={selectedRoomType || undefined}
                            onChange={(e) => {
                                setSelectedRoomType(e);
                            }}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option key="00000000-0000-0000-0000-000000000000" value="00000000-0000-0000-0000-000000000000">All Room Type</Option>
                            {roomType.map((item: any) =>
                                <Option key={item.guid} value={item.guid}>{item.ten}</Option>
                            )}
                        </Select>
                    </div>
                    <Divider />
                    <div className="col-span-12">
                        <CLoading visible={loading}>
                            <Table
                                columns={columns}
                                dataSource={dataProject}
                                className={`${classesTable.table} mt-1`}
                                pagination={{ position: ["bottomRight"], pageSize: 8, hideOnSinglePage: true }}
                                size="small"
                                scroll={{ y: `300px` }}
                                style={{ height: 'calc(100vh - 340px)' }}
                                bordered={false}
                                rowKey={'guid'}
                                rowSelection={{
                                    type: 'checkbox',
                                    hideSelectAll: true,
                                    onSelect: (record: RoomInfo, selected: boolean, selectedRows: RoomInfo[], nativeEvent: Event) => {
                                        if (selected)
                                            if (selectedRows.length <= dataSelected.length) {
                                                dataSelected.forEach((guest: SelectedGuestProfile, guestIndex) => {
                                                    selectedRows.forEach((room, roomIndex) => {
                                                        if (guestIndex === roomIndex) {
                                                            checkRoomCondition(guest, room)
                                                        }
                                                    })
                                                })
                                            }
                                    }
                                }}
                            />
                        </CLoading>
                    </div>
                </form>
            }
        />
    );
};

export default React.memo(ModalAssignRoom);