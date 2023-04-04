import React from 'react';
import { Helmet } from "react-helmet";
import { useSelectorRoot } from 'redux/store';

function EndOfDay(): JSX.Element {
    const { hotelName } = useSelectorRoot(state => state.app);
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Helmet>
                <title>{hotelName} - End Of Day</title>
            </Helmet>
            End Of Day
        </div>
    )
}
export default EndOfDay