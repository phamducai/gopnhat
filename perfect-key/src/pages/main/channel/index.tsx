import React from 'react';
import { Helmet } from "react-helmet";
import { useSelectorRoot } from 'redux/store';
function Channel(): JSX.Element {
    const { hotelName } = useSelectorRoot(state => state.app);
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Helmet>
                <title>{hotelName} - Channel</title>
            </Helmet>
            Channel
        </div>
    )
}
export default Channel