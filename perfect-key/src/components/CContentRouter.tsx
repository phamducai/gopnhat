
import { RouterItem } from "common/define-type";
import Role from "common/roles";
import React, { Suspense } from 'react';
import { Switch } from "react-router-dom";
import CLoading from "./CLoading";
import CPrivateRoute from "./CPrivateRouter";

const BookingModule = React.lazy(() => import("pages/main/booking"));
const DashboardModule = React.lazy(() => import("pages/main/dashboard/Dashboard"));
const FrontDeskModule = React.lazy(() => import("pages/main/front-desk"));
const RoomPlanModule = React.lazy(() => import("pages/main/front-desk/RoomPlan"))
const WalkInCompoent = React.lazy(() => import("pages/main/front-desk/RoomPlan/walk-in"))
const CheckInComponent = React.lazy(() => import("pages/main/front-desk/CheckIn"));
const ArriavlList = React.lazy(() => import("pages/main/front-desk/ArrivalList"));
const CashierModule = React.lazy(() => import("pages/main/cashier"));
const FolioModule = React.lazy(() => import("pages/main/cashier/Folio"));
const ChannelModule = React.lazy(() => import("pages/main/channel"));
const ReportModule = React.lazy(() => import("pages/main/report"));
const ReservationModule = React.lazy(() => import("pages/main/booking/reservation"));
const EditReservationModule = React.lazy(() => import("pages/main/booking/reservation/editReservation"));
const EditGroupInHouse = React.lazy(() => import("pages/main/front-desk/RoomPlan/edit-group"));
const PageNotFound = React.lazy(() => import("pages/404"))
const RoomRackModule = React.lazy(() => import("pages/main/front-desk/RoomRack"));
const RoomMangementModule = React.lazy(() => import("pages/main/room-management"));
const EndOfDayModule = React.lazy(() => import("pages/main/end-of-day"));
const ToolsModule = React.lazy(() => import("pages/main/tools"));
const MiscellaneousModule = React.lazy(() => import("pages/main/miscellaneous"));
const RouterArr: RouterItem[] = [
    {
        path: "/",
        component: DashboardModule,
    },
    {
        path: "/dashboard",
        component: DashboardModule,
    },
    {
        path: "/booking",
        component: BookingModule,
    },
    {
        path: "/booking/search",
        component: BookingModule,
        role: Role.FO_FOM_GM
        // vytran

    },
    {
        path: "/booking/new",
        component: ReservationModule,
        role: Role.FO_FOM_GM
        // vytran

    },
    {
        path: "/booking/edit-group/:idRsvn",
        component: ReservationModule,
        role: Role.FO_FOM_GM
        // vytran
    },
    {
        path: "/booking/edit-rsvn/:trRoomGuid",
        component: EditReservationModule ,
        role: Role.FO_FOM_GM
        // vytran
    },
    {
        path: "/front-desk",
        component: FrontDeskModule,
    },
    {
        path: "/front-desk/room-plan",
        component: RoomPlanModule,
    },
    {
        path: "/front-desk/room-rack",
        component: RoomRackModule,
    },
    {
        path: "/front-desk/room-plan/walk-in",
        component: WalkInCompoent,
    },
    {
        path: "/front-desk/check-in/:trRoomGuid",
        component: CheckInComponent,
        role: Role.FO
        // vytran
    },
    {
        path: "/front-desk/edit-group-inhouse/:rsvnId",
        component: EditGroupInHouse,
        role: Role.FO_FOM_GM
        // vytran
    },
    {
        path: "/front-desk/arrival-list",
        component: ArriavlList,
    },
    {
        path: "/cashier",
        component: CashierModule,
    },
    {
        path: "/cashier/folio/:tsRoomGuid",
        component: FolioModule,
    },
    {
        path: "/channel",
        component: ChannelModule,
    },
    {
        path: "/report",
        component: ReportModule,
    },
    {
        path: "/end-of-day",
        component: EndOfDayModule,
    },
    {
        path: "/room-management",
        component: RoomMangementModule,
    },
    {
        path: "/tools",
        component: ToolsModule,
    },
    {
        path: "/miscellaneous",
        component: MiscellaneousModule,
    },
    {
        path: "*",
        component: PageNotFound
    }
];

function ContentRouterCom({ path: parentPath }: { path: string }): JSX.Element {
    return (
        <Suspense fallback={<CLoading visible={true} fullScreen={true} />}>
            <Switch>
                {RouterArr.map(({ path, component: Component, isPrivate, role, ...rest }) => {
                    const newPath = `${parentPath}${path}`;
                    return (
                        <CPrivateRoute path={newPath} key={path} exact={true} role={role} {...rest}>
                            <Component />
                        </CPrivateRoute>
                    )
                })}
            </Switch>
        </Suspense>
    )
}

const CContentRouter = React.memo(ContentRouterCom);
export default CContentRouter