import React from 'react';
import { Helmet } from "react-helmet";
import { useSelectorRoot } from 'redux/store';

function RoomManagement(): JSX.Element {
    const { hotelName } = useSelectorRoot(state => state.app);
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Helmet>
                <title>{hotelName} - Room Management</title>
            </Helmet>
            Room Management
        </div>
    )
}
export default RoomManagement