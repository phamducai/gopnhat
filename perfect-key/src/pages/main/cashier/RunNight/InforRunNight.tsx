/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "antd";
import { IRoomChargeRunNight, IRoomRevenue } from "common/end-of-day/model-runNight";
import { TypeRunNight } from "common/enum/runnight.enum";
import { IQueryParamRunNight } from "common/model-booking";
import { IResArrivalsDepartures } from "common/model-statistic";
import Utils from "common/utils";
import { styleInput } from "pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style";
import React, { useEffect, useState } from "react";
import {  setSearchRunNightSuccess } from "redux/controller/cashier/folio/folio.slice";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import StatisticService from "services/frontdesk/statistic.service";
import RunNightService from "services/report/RunNightService";
import { useStyleTheme } from "theme";
const InforRunNight = ({ setQueryDataRunNight, setLoadingTableRunNight, setTotalRoomProN, setRoomRevenueProN, setRoomChargeNightProN }: any) => {
    const classes = useStyleTheme(styleInput);
    const dispatch = useDispatchRoot();
    const { hotelId, numberOfRooms } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);

    const { listStatisticGuest, availableTonight } = useSelectorRoot(state => state.frontdesk);
    
    const [totalRoom, setTotalRoom] = useState<number>(0);
    const [resArrivalsDepartures, setResArrivalsDepartures] = useState<IResArrivalsDepartures | null>(null);
    const [roomChargeNight, setRoomChargeNight] = useState<IRoomChargeRunNight | null>(null);
    const [roomRevenue, setRoomRevenue] = useState<IRoomRevenue | null>(null);

    const occupiedTonight =((listStatisticGuest.inHouse.room / (availableTonight + listStatisticGuest.inHouse.room)) * 100 ).toFixed(2)

    useEffect(() =>{
        const fetchRoom = async () =>{
            const resp = await RunNightService.getTotalRoomByHotelId(hotelId);
            setTotalRoom(resp);
            setTotalRoomProN(resp ?? 0);
        }
        fetchRoom();
    }, [hotelId])
    
    useEffect(() => {
        const loadDataTable = async () => {
            const response: IResArrivalsDepartures = await StatisticService.getRoomAndGuestByDate(hotelId, businessDate);
            setResArrivalsDepartures(response);
        }
        loadDataTable();
    }, [businessDate, hotelId])
    useEffect(() => {
        const fetchRoomCharge = async () => {
            const resp = await RunNightService.getRoomChargeRunNight(hotelId);
            let listTsRoomId: string[] =[];
            if(resp){
                listTsRoomId = resp.listInHouseId;
            }
            const respRoomRevenue = await RunNightService.getRoomRevenue(hotelId,businessDate, listTsRoomId);
            setRoomChargeNight(resp);
            setRoomRevenue(respRoomRevenue)
            if(respRoomRevenue){
                setRoomChargeNightProN(resp?.debitRoomCharge ?? 0);
                setRoomRevenueProN(respRoomRevenue?.roomRevenue ?? 0);
            }
        }
        fetchRoomCharge();
    }, [hotelId, businessDate])
    const onClickInput = async (type: number, isOnlyMainGuest: boolean) => {
        setLoadingTableRunNight(true);
        const queryParamsDTO: IQueryParamRunNight = {
            status: type === TypeRunNight.ExpectedArrivals ? 0 : 1,
            isOnlyMainGuest,
            occupiedTonight: type === TypeRunNight.OccupiedTonight ? true : false,
            houseUse: type === TypeRunNight.HouseUse ? true : false,
            complimentary: type === TypeRunNight.Complimentary ? true : false,
            expectedArrivals: type === TypeRunNight.ExpectedArrivals ? true : false,
            expectedDepartures: type === TypeRunNight.ExpectedDepartures ? true : false,
            roomRevenue: type === TypeRunNight.RoomRevenue ? true : false,
            RoomCharge: type === TypeRunNight.RoomCharge ? true : false,
            businnesDate: businessDate,
            hotelGuid: hotelId,
            listInHouseId: (type === TypeRunNight.RoomCharge || type === TypeRunNight.RoomRevenue) ? roomChargeNight?.listInHouseId : [],
        }
        const resp = await RunNightService.getInfoNightByQueryParam(queryParamsDTO, numberOfRooms);
        if(resp.queryParamsReq || resp.inforPage){
            setQueryDataRunNight(queryParamsDTO);
            dispatch(setSearchRunNightSuccess({ 
                queryParam : resp.queryParam, 
                dataSearchResults: resp.dataSearchResults,
                inforPage: resp.inforPage
            }));
        }
        setLoadingTableRunNight(false);
    }
    const numberRoomRevenue = listStatisticGuest.inHouse.room - (roomChargeNight?.numberRoomCharge ?? 0) - (resArrivalsDepartures?.complimentary.room ?? 0) - (resArrivalsDepartures?.houseUse.room ?? 0);
    return(
        <div className="col-span-4 bg-white p-4 grid grid-cols-5 gap-x-4 gap-y-2 custom-scrollbar-pkm shadow-xl" style={{height: `calc(100vh - 100px)` }}>
            <div className="col-span-3">
                <label className="m-0 font-base font-bold">
                    Room No.:
                </label>
            </div>
            <div className="col-span-1">
                <label className="m-0 font-base font-bold">
                    Room
                </label>
            </div>
            <div className="col-span-1">
                <label className="m-0 font-base font-bold">
                    PAX
                </label>
            </div>
            <div className="col-span-3"></div>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={totalRoom}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <div className="col-span-3">
                <label className="m-0 font-base font-bold">Expected Arrivals</label><br/>
                <label className="m-0 font-base font-bold" style={{ color: "#F24FB1"}}>(Set to No-Show)</label>
            </div>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={listStatisticGuest.arrivals?.expected.room}
                onClick={() => onClickInput(TypeRunNight.ExpectedArrivals, true)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={listStatisticGuest?.arrivals?.expected.guest}
                onClick={() => onClickInput(TypeRunNight.ExpectedArrivals, false)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <div className="col-span-3 flex items-center">
                <label className="m-0 font-base font-bold">Expected Departures</label>
            </div>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={listStatisticGuest.departures?.expected.room}
                onClick={() => onClickInput(TypeRunNight.ExpectedDepartures, true)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={listStatisticGuest.departures?.expected.guest}
                onClick={() => onClickInput(TypeRunNight.ExpectedDepartures, false)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <div className="col-span-5 mb-6">
                <label className="m-0 font-base font-bold" style={{ color: "#F24FB1"}}>(Auto extend one night to post room charge)</label>
            </div>
            <div className="col-span-2 flex items-center">
                <label className="m-0 font-base font-bold">Occupied Tonight</label>
            </div>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={occupiedTonight ? occupiedTonight : 0}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={listStatisticGuest.inHouse.room}
                onClick={() => onClickInput(TypeRunNight.OccupiedTonight, true)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={listStatisticGuest.inHouse.guest}
                onClick={() => onClickInput(TypeRunNight.OccupiedTonight, false)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <div className="col-span-2 flex items-center">
                <label className="m-0 font-base font-bold">House Use (F.O.C)</label>
            </div>
            <div className="col-span-1"></div>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={resArrivalsDepartures?.houseUse.room}
                onClick={() => onClickInput(TypeRunNight.HouseUse, true)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={resArrivalsDepartures?.houseUse.guest}
                onClick={() => onClickInput(TypeRunNight.HouseUse, false)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <div className="col-span-2 flex items-center">
                <label className="m-0 font-base font-bold">Complimentary (F.O.C)</label>
            </div>
            <div className="col-span-1"></div>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={resArrivalsDepartures?.complimentary.room}
                onClick={() => onClickInput(TypeRunNight.Complimentary, true)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={resArrivalsDepartures?.complimentary.guest}
                onClick={() => onClickInput(TypeRunNight.Complimentary, false)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <div className="col-span-2 flex items-center">
                <label className="m-0 font-base font-bold">Rooms advanced room charge</label>
            </div>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={roomChargeNight?.numberRoomCharge ?? 0}
                onClick={() => onClickInput(TypeRunNight.RoomCharge, true)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <Input
                className={`${classes.input} col-span-2 text-right`}
                value={Utils.formatNumber(roomChargeNight?.debitRoomCharge ?? 0)}
                type="text" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <div className="col-span-2 flex items-center">
                <label className="m-0 font-base font-bold">Room Revenue</label>
            </div>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                value={numberRoomRevenue}
                onClick={() => onClickInput(TypeRunNight.RoomRevenue, true)}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <Input
                className={`${classes.input} col-span-2 text-right`}
                value={Utils.formatNumber(roomRevenue?.roomRevenue ?? 0)}
                type="text" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
            <div className="col-span-5 mb-6">
                <label className="m-0 font-base font-bold" style={{ color: "#F24FB1"}}>(Total room charge will post by Night Auditor)</label>
            </div>
            <div className="col-span-5">
                <label className="m-0 font-base font-bold">Click mouse/touch on item to view details</label>
            </div>
            <div className="col-span-3 flex items-center">
                <label className="m-0 font-base font-bold">Sleep - Skip Rooms</label>
            </div>
            <Input
                className={`${classes.input} col-span-1 text-center`}
                type="number" style={{ background: "#F5F6F7", height: 40 }}>
            </Input>
        </div>
    )
}
export default React.memo(InforRunNight);