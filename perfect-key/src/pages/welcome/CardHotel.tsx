/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react"
import CIconSvg from "components/CIconSvg";
import { useSelectorRoot } from "redux/store";
import SYSTEM_CONSTANTS from "common/constants";

function CCardHotel(props: any): JSX.Element {
    const { hotelName, location, selectHotel, guid, businessDate, lastNightAudit, organizationId, image } = props;
    const { systemConfig } = useSelectorRoot(x => x.bootstrap);
    return (
        <div className="rounded shadow-lg w-60 p-2 space-y-1 cursor-pointer transform hover:scale-110 transition duration-300 ease-in-out"
            onClick={() => selectHotel({ hotelName: hotelName, hotelId: guid, businessDate,lastNightAudit, organizationId  })} >
            <img src={`${systemConfig.hostImage}/${SYSTEM_CONSTANTS.IMAGE.IMAGE_HOTEL}/${image}/publish`} alt={hotelName} />
            <div className="p-2 space-y-2 text-gray-pkm">
                <span className="font-bold text-md text-black-pkm">{hotelName}</span>
                <div className="flex flex-row items-start justify-start space-x-1">
                    <CIconSvg name="map-pin" colorSvg="origin" svgSize="medium" />
                    <span className="-mt-1 truncate">{location}</span>
                </div>
                {/* <div className="flex flex-row items-start justify-start space-x-1">
                    <CIconSvg name="bell" colorSvg="origin" svgSize="medium" />
                    <span className="-mt-1">{`6 new reservations`}</span>
                </div> */}
            </div>
        </div>
    )
}

const CardHotel = React.memo(CCardHotel);
export default CardHotel