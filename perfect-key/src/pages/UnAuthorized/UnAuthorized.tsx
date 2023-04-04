import React from 'react'
import { Helmet } from "react-helmet";
import CUnAuthorzied from 'components/CUnAuthorzied';
import Navbar from './../main/navbar/index';

const UnAuthorized = (): JSX.Element => {
    return (
        <>
            <Helmet>
                <title>403 - Unauthorized</title>
            </Helmet>
            <div className="absolute inset-0 z-30 bg-white">
                <Navbar />
                <CUnAuthorzied />
            </div>
        </>
    )
}

export default React.memo(UnAuthorized)