/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Space, Table } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import PkmApi from 'api/pkm/pkm.api';
import clsx from 'clsx';
import { ReservationStatus } from 'common/enum/booking.enum';
import { NotificationStatus } from 'common/enum/shared.enum';
import GLobalPkm from 'common/global';
import { ISearchResult } from 'common/model-booking';
import { TransactionRoomInfo } from 'common/model-rsvn';
import { DEFAULT_RESINSTATETREE_VALUE, ReinstateTreeTable } from 'common/search/model-reinstateRsvn';
import Utils from 'common/utils';
import CModel from 'components/CModal';
import openNotification from 'components/CNotification';
import { styleReinstateTable } from 'components/CStyleTable';
import { cloneDeep, groupBy } from 'lodash';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { searchWithQueryParam, searchRequest, updateResetCheckBoxSearchResultTalble } from 'redux/controller';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import ReinstateService from 'services/booking/reinstate/reinstate.services';
import { createStyles, ThemeDefine, useStyleTheme } from 'theme';

interface PropsReinstateRSVN{
    data?: ISearchResult[],
    setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>
}

enum ModalOption{
    None = 0,
    ReinstateModal = 1,
    CheckInModal = 2
}

const ModalReinstateRSVN = ({setVisibleModal}: PropsReinstateRSVN) : JSX.Element => {
    const styleCTableSearchResults = createStyles((theme:ThemeDefine) => ({
        // table:{
        //     height: `calc(${theme.height.fullScreen} - (${heightHeader} + ${theme.height.navbar} + ${theme.height.paddingYPage}))`
        // },
        trColorGuest : {
            color : "#00293B"
        },
        trColorGuestMain : {
            color : '#1A87D7'
        },
        fontWeight: {
            fontWeight: "600",
            color : '#1A87D7'
        }
    }));
    const classes = useStyleTheme(styleCTableSearchResults)
    const classesTable = useStyleTheme(styleReinstateTable)
    const { changeStatusProfiles, dataSearchResults, formSearchQuery, formSearch } = useSelectorRoot(state => state.booking);
    const { noShowRSVN } = useSelectorRoot(state => state.rsvn)
    const { numberOfRooms } = useSelectorRoot(state => state.app)
    const hotelId = useSelectorRoot(state => state.app.hotelId)
    const [ selectedRows, setSelectedRows] = useState<ReinstateTreeTable[]>([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useState<React.Key[]>([]);
    const [ expandedData, setExpandedData ] = useState<ISearchResult[]>([]);
    const [ modalSwitch, setModalSwitch ] = useState<ModalOption>(1);
    const [ convertedData, setConvertedData ] = useState<ReinstateTreeTable[]>([]);
    const dispatch = useDispatchRoot();

    useEffect(() => {
        getExpandDataForMasterGuest();
    }, [noShowRSVN])

    useEffect(() => {
        refreshConvertedData();
    }, [expandedData])

    const handleSearch = () => {
        const data = {
            pageNumber : changeStatusProfiles ? formSearch.pageNumber : 1,
            pageSize : formSearch.pageSize !== 1 ? formSearch.pageSize :  10,
            hotelGuid: hotelId,
            isOnlyMainGuest: formSearch.isOnlyMainGuest,
            arrivalDates: formSearchQuery.dateArrival,
            departureDates: formSearchQuery.dateDeparture,
            companyAgentGuid: formSearchQuery.companyAgent,
            status: formSearchQuery?.searchBy,
            rsvnCode: '',
            rsvnNo: formSearchQuery.rsvn,
            room: formSearchQuery.room,
            availableDate: formSearchQuery?.availableDate,
            profiles:{
                phone: formSearchQuery.phone,
                passport: formSearchQuery.passport,
                firstName: formSearchQuery.firstName,
                guestName: formSearchQuery.guestName
            },
            roomType: formSearch.roomType,
            groupCode: formSearch.groupCode,
            listRoomType: numberOfRooms //roomType
        }
        if (!formSearchQuery?.firstName && !formSearchQuery?.guestName && !formSearchQuery?.passport && !formSearchQuery?.phone) {
            dispatch(searchWithQueryParam({...data, profileIds: []}))
        }else{
            dispatch(searchRequest(data))
        }
    }

    const columns = [
        {
            title: 'Fullname',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '120px'
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            width: '100px'
        },
        {
            title: 'RoomType',
            dataIndex: 'roomType',
            key: 'roomType',
            width: '100px'
        },
        {
            title: 'Arrival',
            dataIndex: 'arrival',
            key: 'arrival',
            width: '100px'
        },
        {
            title: 'Departure',
            dataIndex: 'departure',
            key: 'departure',
            width: '100px'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '100px'
        },
        {
            title: 'Action',
            key: 'operation',
            width: '120px',
            dataIndex: 'operation',
            // eslint-disable-next-line react/display-name
            render: (text: any, record: ReinstateTreeTable) => (
                record?.parentMeGuid ? 
                    <Space size="middle">
                        <Button type="primary" onClick={() => {notiForSetMasterGuest(record.parentMeGuid, record.guid, record.fullName)}}>Set Master</Button>
                    </Space> : ""),
              
        }
    ];

    // Get expand guest from master guest
    const getExpandDataForMasterGuest = () => {
        const results: ISearchResult[] = [];
        const guids = noShowRSVN.map(res => res.guid);
        noShowRSVN.forEach(item => {
            results.push({...item});
            if(!item.parentMeGuid){
                const tmp = dataSearchResults.filter(x => x.parentMeGuid === item.guid && guids.indexOf(x.guid) === -1 && x.status.id === ReservationStatus.NoShow);
                results.push(...tmp as ISearchResult[]);
            }
        })
        setExpandedData(results);
    }

    

    const setMasterGuest = async (oldMasterGuestId: string | number | null, newMasterGuestId: string | null, newMasterGuestName: string | null) => {
        let message: string;
        let description: string;
        PkmApi.changeMainGuest(oldMasterGuestId?.toString() || "", newMasterGuestId?.toString() || "").subscribe(
            async (res) => {
                message = `Set MasterGuest`;
                description = `The guest ${newMasterGuestName} has been successfully set to MasterGuest`;
                openNotification(NotificationStatus.Success, message, description);
                setExpandedData(await ReinstateService.syncWhenChangeMasterGuest(oldMasterGuestId, newMasterGuestId, expandedData));
                setSelectedRowKeys([]);
            },
            (err) => {
                message = `Set MasterGuest`;
                description = `Somethings got wrong.\n${err}.\nPlease try again!`;
                openNotification(NotificationStatus.Error, message, description);
            }
        )
        handleSearch();
    }
    
    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        //selectedRows: selectedRows,
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            setSelectedRowKeys(selectedRowKeys);
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            console.log(selectedRows);
            setSelectedRows(selectedRows)
        },
        // onSelect: (record: any, selected: any, selectedRows: any) => {
        //     console.log(record, selected, selectedRows);
        // },
        // onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
        //     console.log(selected, selectedRows, changeRows);
        // },
    };

    const refreshConvertedData = () => {
        const groupData = groupBy(expandedData, (x) => x.room.name);
        console.log(groupData);
        const convertedData: ReinstateTreeTable[] = [];
        let i = 1;
        for (const key in groupData) {
            const tmp: ReinstateTreeTable = cloneDeep(DEFAULT_RESINSTATETREE_VALUE);
            tmp.key = i;
            tmp.fullName = "Room " + groupData[key][0].room.name;
            tmp.children = ReinstateService.convertNestedValueToSingle(groupData[key], i);
            convertedData.push(tmp);
            i++;
        }
        setConvertedData(convertedData);
    }
    const renderMenu = () : JSX.Element => {
        return (
            <div>
                {convertedData.length > 0 ?
                    <Table className={clsx(classesTable.table)}
                        columns={columns}
                        pagination={false}
                        rowSelection={{ ...rowSelection, checkStrictly: false }}
                        dataSource={convertedData}
                        rowClassName={( record ) => {
                            return record.guid ? (record.parentMeGuid ? classes.trColorGuest : classes.trColorGuestMain) : classes.fontWeight
                        }}
                        scroll={{ x: 100, y: 300 }}
                        defaultExpandAllRows={true}
                    />
                    : 
                    ""
                }
            </div>
        )
    }

    const renderCheckInModal = () : JSX.Element => {
        return (
            <h3>Do you want to check in those guests?</h3>
        )
    }

    const notiForSetMasterGuest = (oldMasterGuestId: string | number | null, newMasterGuestId: string | null, newMasterGuestName: string | null) => {
        confirm({
            title: `Notification`,
            content: `Are you sure to set ${newMasterGuestName} to MasterGuest?`,
            onOk() {
                setMasterGuest(oldMasterGuestId, newMasterGuestId, newMasterGuestName);
            }
        });
    }

    const onSubmitReinstate = async () => {
        const transactionRequest = ReinstateService.prepareBodyRequest(ReservationStatus.Reservation, selectedRows, numberOfRooms);
        const transactionRooms = selectedRows.filter(item => !Utils.isNullOrEmpty(item.guid))
        const groupData = groupBy(transactionRooms, x => x.room);
        const defaultGuid = GLobalPkm.defaultBytes32;
        console.log(groupData);
        const notiLackOfMainGuests: string[] = [];
        // check lack of mainGuests
        for(const key in groupData){
            const indx = groupData[key].findIndex(item => !item.parentMeGuid || item.parentMeGuid === defaultGuid);
            if(indx === -1) {
                const firstElement = groupData[key][0];
                const trsInfo: TransactionRoomInfo | null = await PkmApi.getTrsInfo(firstElement.parentMeGuid ? firstElement.parentMeGuid.toString() : "");
                if(trsInfo?.status !== ReservationStatus.Reservation && trsInfo?.status !== ReservationStatus.CheckIn){
                    groupData[key][0].room && notiLackOfMainGuests.push(groupData[key][0].room || '')
                }
            }
        }
        if(transactionRequest.length > 0){
            if(notiLackOfMainGuests.length > 0){
                ReinstateService.notifyLackOfMasterGuest(notiLackOfMainGuests);
                return;
            }
            PkmApi.setStateForMultiTransactionRoomsReinstate(false, transactionRequest).subscribe(
                (res: any) => {
                    if(res.result === true){
                        setModalSwitch(ModalOption.CheckInModal);
                        openNotification(NotificationStatus.Success, 'Done', 'Reinstate RSVN successfully!')
                    }
                    else{
                        openNotification(NotificationStatus.Error, 'Error', `Reinstate RSVN caught errors.\n ${res.message}\nPlease try again!`)
                        afterCloseReinstateModal();
                    }
                },
                (err) => {
                    openNotification(NotificationStatus.Error, 'Error', `${err?.response?.message}\nYou should consider another Room Type!`)
                    afterCloseReinstateModal();
                }
            )
        }
        else{
            afterCloseReinstateModal();
        }
    }

    const afterCloseReinstateModal = () => {
        setVisibleModal(false);
        handleSearch();
        dispatch(updateResetCheckBoxSearchResultTalble(true));
    }

    const onCheckInSubmit = () => {
        // Write for checkin Submit
        const transactionRequest = ReinstateService.prepareBodyRequest(ReservationStatus.CheckIn, selectedRows, numberOfRooms);
        PkmApi.setStateForMultiTransactionRoomsReinstate(false, transactionRequest).subscribe(
            (res: any) => {
                if(res.result === true){
                    openNotification(NotificationStatus.Success, 'Done', 'Check-in successfully!')
                    //setMasterGuest()
                }
                else{
                    const roomHasUses: string[] = res.roomHasUses;
                    const roomInfos = selectedRows.filter(item => !Utils.isNullOrEmpty(item.guid) && roomHasUses.indexOf(item.roomId ? item.roomId : 'namdd') !== -1);
                    let errorNoti = "";
                    roomInfos.forEach(item => {
                        errorNoti += `\n${item.fullName} in room ${item.room}`
                    })
                    openNotification(NotificationStatus.Error, 'Error', `${res.message}\nList room are in use:${errorNoti}\nPlease try again!`)
                }
                afterCloseReinstateModal();
            },
            (err) => {
                const roomHasUses: string[] = err.response.roomHasUses;
                const roomInfos = selectedRows.filter(item => !Utils.isNullOrEmpty(item.guid) && roomHasUses.indexOf(item.roomId ? item.roomId : 'namdd') !== -1);
                let errorNoti = "";
                roomInfos.forEach(item => {
                    errorNoti += `\n${item.fullName} in room ${item.room}`
                })
                openNotification(NotificationStatus.Error, 'Error', `${err.message}\nList room are in use:${errorNoti}\nPlease try again!`)
                afterCloseReinstateModal();
            }
        )
    }

    const onCancelCheckIn = () => {
        afterCloseReinstateModal();
    }

    return (
        modalSwitch === ModalOption.ReinstateModal ?
            <CModel
                title="Reinstate Reservations"
                visible={true}
                width={"80%"}
                zIndex={1}
                onOk={() => {onSubmitReinstate()}}
                onCancel={() => afterCloseReinstateModal()}
                content={
                    renderMenu()
                }
            />
            :
            <CModel
                title="Check In"
                visible={true}
                width={"50%"}
                zIndex={1}
                onOk={() => {onCheckInSubmit()}}
                onCancel={() => {onCancelCheckIn()}}
                content={
                    renderCheckInModal()
                }
            />
    )
}

export default ModalReinstateRSVN;