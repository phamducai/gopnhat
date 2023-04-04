import React from 'react';
import { Helmet } from "react-helmet";
import { useSelectorRoot } from 'redux/store';

function Tools(): JSX.Element {
    const { hotelName } = useSelectorRoot(state => state.app);
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Helmet>
                <title>Tools - {hotelName}</title>
            </Helmet>
            Tools
        </div>
    )
}
export default Tools