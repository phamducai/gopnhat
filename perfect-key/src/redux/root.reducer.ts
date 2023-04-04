import { combineReducers } from "@reduxjs/toolkit";
import { combineEpics } from "redux-observable";
import { companyReducer, BoostrapEpics, bootstrapReducer, LoginEpics, loginReducer, appReducer, bookingReducer, 
    BookingEpics, hotelReducer, HotelEpics, frontdeskReducer, CompanyEpics, roomPlanReducer, RoomPlanEpics, FrontDeskEpics, reportReducer, ApppEpics
} from './controller';
import { FolioEpics, folioReducer } from "./controller/cashier/folio/folio.slice";
import { roomRackReducer } from "./controller/frontdesk/roomrack.slice";

import { HotelConfigEpic, hotelConfigReducer } from "./controller/hotelconfig.slice";
import { ReservationEpics, rsvnReducer } from "./controller/reservation.slice";
import { TraceEpics, traceReducer } from "./controller/trace.slice";
// import { hotelReducer, HotelEpics } from "./controller/hotel.slice";
const rootReducer = combineReducers({
    app: appReducer,
    frontdesk: frontdeskReducer,
    booking: bookingReducer,
    bootstrap: bootstrapReducer,
    login: loginReducer,
    rsvn: rsvnReducer,
    hotel: hotelReducer,
    company: companyReducer,
    roomPlan: roomPlanReducer,
    roomRack : roomRackReducer,
    hotelConfig: hotelConfigReducer,
    folio: folioReducer,
    report: reportReducer,
    trace: traceReducer
});

export const rootEpic = combineEpics(
    ...BoostrapEpics,
    ...LoginEpics,
    ...BookingEpics,
    ...ReservationEpics,
    ...HotelEpics,
    ...CompanyEpics,
    ...HotelConfigEpic,
    ...RoomPlanEpics,
    ...FrontDeskEpics,
    ...FolioEpics,
    ...ApppEpics,
    ...TraceEpics
);
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;