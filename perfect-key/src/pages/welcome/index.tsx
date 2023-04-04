import { handleRefreshTokenWithOrgId } from "api/http-client";
import { IHotel as Hotel } from "common/define-type";
import Utils from "common/utils";
import CLoading from "components/CLoading";
import backgroundWelcome from 'image/bg-welcome.png';
import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { selectHotel } from 'redux/controller';
import { getListHotelRequest } from "redux/controller/hotel.slice";
import { fetchNumberOfRooms } from "redux/controller/reservation.slice";
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import CardHotel from './CardHotel';
export default function Welcome(): JSX.Element {
    const { listHotel, loading } = useSelectorRoot(state => state.hotel)
    const history = useHistory();
    const dispatch = useDispatchRoot();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(getListHotelRequest(""));
    }, [dispatch])
    
    async function handleSelectHotel(data: Hotel) {
        dispatch(selectHotel(data));
        const res = await handleRefreshTokenWithOrgId(data.organizationId)
        if(res){
            Utils.setLocalStorage("organizationId", data.organizationId);
            dispatch(fetchNumberOfRooms({
                hotelGuid: data.hotelId
            }))
            history.push("/main")
        }else{
            history.push("/")
        }
    }

    return (
        <CLoading
            visible={loading}
            className="w-screen h-screen grid flex-col justify-center items-center overflow-auto"
            style={{ gridTemplateRows: '1fr 3fr 252px' }}>
            <Helmet>
                <title>{t("WELCOME.welcome")}</title>
            </Helmet>
            <div className="flex flex-col justify-center items-center space-y-4 text-center text-black-pkm font-bold">
                <span className="text-3xl">{t("WELCOME.welBack")}</span>
                <span className="text-xl">{t("WELCOME.selectHotel")}</span>
            </div>
            <div className="flex flex-row flex-wrap justify-center items-start h-full space-x-3 mt-4">
                {
                    listHotel.map((item, index) => {
                        return (
                            // <CardHotel key={index} selectHotel={handleSelectHotel} {...listHotel} />
                            <CardHotel key={index} {...item} selectHotel={handleSelectHotel} />
                        )
                    })
                }
            </div>
            <div className="w-full flex">
                <img src={backgroundWelcome} alt="bg-welcome" className="w-1/2" />
                <img src={backgroundWelcome} alt="bg-welcome" className="w-1/2" />
            </div>
        </CLoading>
    )
}
