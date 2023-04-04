import { Button, Modal } from "antd";
import { IResArrivalsDepartures } from "common/model-statistic";
import Utils from "common/utils";
import CIconSvg from "components/CIconSvg";
import { styleReservation } from "components/CModal";
import addDays from "date-fns/addDays";
import React, { useEffect, useState } from "react";
import { listStaticGuest, setAvaiableToNight } from "redux/controller";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import StatisticService from "services/frontdesk/statistic.service";
import { useStyleTheme } from "theme";
import InforRunNight from "./InforRunNight";
import TableRunNight from "./TableRunNight";
import GLobalPkm from 'common/global';
import RoomPlanService from "services/frontdesk/roomplan.service";
import RunNightService from "services/report/RunNightService";
import { setLoadingTableRunNight } from "redux/controller/cashier/folio/folio.slice";
import { IQueryParamRunNight } from "common/model-booking";
import { IRunNightCommon } from "common/end-of-day/model-runNight";

interface RunNightProps{
    isShowModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
}
const RunNight = ({isShowModal, setShowModal}: RunNightProps) => {
    const classes = useStyleTheme(styleReservation);
    const dispatch = useDispatchRoot();
    const { hotelId, hotelName } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
    const { listStatisticGuest, availableTonight } = useSelectorRoot(state => state.frontdesk);
    const [totalRoom, setTotalRoom] = useState<number>(0);
    const [roomRevenue, setRoomRevenue] = useState<number>(0);
    const [roomChargeNight, setRoomChargeNight] = useState<number>(0);
    const [queryDataRunNight, setQueryDataRunNight] = useState<IQueryParamRunNight>({
        pageNumber: 1,
        pageSize: 20,
        status:  1,
        isOnlyMainGuest: false,
        occupiedTonight: false,
        houseUse: false,
        complimentary: false,
        expectedArrivals: false,
        expectedDepartures: false,
        roomRevenue: false,
        businnesDate: businessDate,
        hotelGuid: hotelId,
        listInHouseId: [],
    })

    useEffect(() => {
        const arrivalDate = Utils.convertMiddleDate(businessDate)
        const departureDate = Utils.convertMiddleDate(addDays(new Date(businessDate), 1))
        const loadFrontDesk = async () => { //getRoomAndGuestByDate
            const date = Utils.convertMiddleDate(businessDate)
            const response: IResArrivalsDepartures = await StatisticService.getRoomAndGuestByDate(hotelId, date);
            dispatch(listStaticGuest(response))
        }
        const getAvailableRooms = async () => { // getAvailableRooms
            const roomTypeGuid = GLobalPkm.defaultBytes32
            const dataRooms = await RoomPlanService.getAvailableRooms(hotelId, roomTypeGuid, arrivalDate, departureDate);
            dispatch(setAvaiableToNight(dataRooms.length))
        }
        businessDate && loadFrontDesk()
        businessDate && getAvailableRooms();
    }, [businessDate, dispatch, hotelId])

    const handleCancel = () => {
        dispatch(setLoadingTableRunNight(false));
        setShowModal(false)
    }
    const handleRunNight = async () => {
        setIsLoading(true);
        const occupiedTonight =((listStatisticGuest.inHouse.room / (availableTonight + listStatisticGuest.inHouse.room)) * 100 ).toFixed(2)
        const data: IRunNightCommon = {
            hotelGuid: hotelId,
            nguoiDung2: Utils.getValueLocalStorage("username"),
            serverName: hotelName.replace(/\s+/g, ''),
            language: localStorage.getItem("LANGUAGE") === "vi" ? "vn" : "en",
            statAtNight: {
                roomInHouse: listStatisticGuest.inHouse.room,
                roomNoGuest: totalRoom - listStatisticGuest.inHouse.room,
                occupiedTonight: occupiedTonight,
                houseUse: listStatisticGuest.houseUse.room,
                complimentary: listStatisticGuest.complimentary.room,
                guestInHouse: listStatisticGuest.inHouse.guest,
                timeZone: Utils.getTimeZoneLocal(),
                roomRevenue: roomChargeNight + roomRevenue,
                hotelName: hotelName
            }
        }
        await RunNightService.ProceedRunNight(data);
        setIsLoading(false);
        setShowModal(false);
    }
    return(
        <Modal
            title={<span className={`${classes.titleStyle}`}>{`Prepare Run Night`}</span>}
            visible={isShowModal}
            onCancel={handleCancel}
            destroyOnClose={true}
            closeIcon={<CIconSvg name="close-drawer" hexColor="#F74352" svgSize="default" onClick={() => console.log("")} />}
            className={classes.antModalBody}
            footer={false}
            width={"85%"}
            style={{ top: 10}}
        >
            <div className="grid grid-cols-12 gap-x-1 w-full h-full bg-gray-bg-pkm">
                <InforRunNight 
                    setQueryDataRunNight={setQueryDataRunNight}
                    setLoadingTableRunNight={setIsLoadingTable}
                    setTotalRoomProN={setTotalRoom}
                    setRoomRevenueProN={setRoomRevenue}
                    setRoomChargeNightProN={setRoomChargeNight}
                />
                <div className="col-span-8">
                    <div>
                        <TableRunNight 
                            queryDataRunNight={queryDataRunNight}
                            setQueryDataRunNight={setQueryDataRunNight}
                            isLoadingTable={isLoadingTable}
                            setLoadingTableRunNight={setLoadingTableRunNight}
                            setIsLoadingTable={setIsLoadingTable}
                        />
                    </div>
                    <div className="flex justify-between m-4">
                        <div className="footer-left">
                            <Button
                                style={{ color: "#F74352", border: "1px solid #F74352" }}
                                className={`!rounded-md ${classes.buttonStyle} mr-3`}
                                onClick={handleCancel}
                            >
                                {"Cancel"}
                            </Button >
                            <Button
                                type="primary"
                                disabled
                                className={`!rounded-md ${classes.buttonStyle}`}
                            >
                                Print Room Rate
                            </Button>
                        </div>
                        <div className="footer-right">
                            
                            <Button
                                type="primary"
                                disabled
                                className={`!rounded-md ${classes.buttonStyle} mr-6`}
                            >
                                Refresh
                            </Button>
                            <Button
                                type="primary" htmlType="button"
                                className={`!rounded-md ${classes.buttonStyle}`}
                                loading={isLoading}
                                onClick={() => handleRunNight()}
                            >
                                Proceed Run Night
                            </Button>
                        </div>
                    </div >
                </div>
                
            </div>
        </Modal >
    )
}
export default React.memo(RunNight);