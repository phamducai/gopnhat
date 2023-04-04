import GLobalPkm from "common/global";
import Utils from "common/utils";
import CLoading from "components/CLoading";
import { addDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { setAvaiableToNight } from "redux/controller";
import { getGuestDetailsOptionsRequest } from "redux/controller/reservation.slice";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import RoomPlanService from "services/frontdesk/roomplan.service";
import The4thRow from "./The4thRowMenu";
import The5thRow from "./The5thRowMenu";
import TheFirstRow from "./TheFirstRowMenu";
import TheSecondRow from "./TheSecondRowMenu";
import TheThirdRow from "./TheThirdRowMenu";

const OptionReport = (): JSX.Element => {
    const dispatch = useDispatchRoot();
    const { hotelId } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);

    const [isLoadingPrint, setIsLoadingPrint] = useState<boolean>(false)

    useEffect(() => {
        dispatch(getGuestDetailsOptionsRequest(hotelId));
    }, [dispatch, hotelId])
    
    useEffect(() => {
        const arrivalDate = Utils.convertMiddleDate(businessDate)
        const departureDate = Utils.convertMiddleDate(addDays(new Date(businessDate), 1))
        const getAvailableRooms = async () => { // getAvailableRooms
            const roomTypeGuid = GLobalPkm.defaultBytes32
            const dataRooms = await RoomPlanService.getAvailableRooms(hotelId, roomTypeGuid, arrivalDate, departureDate);
            dispatch(setAvaiableToNight(dataRooms.length))
        }
        businessDate && getAvailableRooms()
    }, [hotelId, businessDate, dispatch])

    return(
        <CLoading visible={isLoadingPrint}>
            <TheFirstRow setIsLoading={setIsLoadingPrint}/>
            <TheSecondRow/>
            <TheThirdRow/>
            <The4thRow/>
            <The5thRow/>
        </CLoading>
    )
}
export default OptionReport;