import { NavbarType } from 'common/define-type';
import CContentRouter from 'components/CContentRouter';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { fetchRoomTypeAvailableRequest, getInfoUser, setNavbar } from 'redux/controller';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import Navbar from './navbar';
import { companyProfilesFilterByInputRequest, getHcfgInfoRequest } from 'redux/controller/reservation.slice';
import Utils from 'common/utils';
import { bussinessDateReq } from 'redux/controller/hotelconfig.slice';
import { setupHTTP } from 'api/http-client';

const ArrNavbarType: NavbarType[] = ['dashboard', 'booking', 'front-desk', 'cashier', 'channel', 'report'];
export default function MainContent(): JSX.Element {
    const { path } = useRouteMatch();
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatchRoot();
    const { hotelId } = useSelectorRoot(state => state.app)

    useEffect(() => {
        setupHTTP(history)
    },[history])
    
    useEffect(() => {
        //const math = Utils.pathNameMatchContent(location.pathname);
        const math: string[] = history.location.pathname.split("/");
        if (math) {
            const navbar = math[1] as NavbarType;
            const user = Utils.getValueLocalStorage("user")
            if (ArrNavbarType.includes(navbar)) {
                dispatch(setNavbar(navbar));
            } else if (math[1] !== 'main') {
                history.push('/login');
            }
            dispatch(getHcfgInfoRequest(hotelId));
            dispatch(companyProfilesFilterByInputRequest({
                hotelGuid: hotelId,
                input: "g"
            }))
            dispatch(fetchRoomTypeAvailableRequest(hotelId))
            user && dispatch(getInfoUser(user))
            dispatch(bussinessDateReq(hotelId))
        } else {
            history.push('/login');
        }

    }, [dispatch, history, location, hotelId])

    return (
        <Router>
            <div className="w-screen h-screen grid" style={{ gridTemplateRows: 'auto 1fr' }}>
                <Navbar />
                <div className="w-full h-full bg-gray-bg-pkm">
                    <CContentRouter path={path} />
                </div>
            </div>
        </Router>
    )
}