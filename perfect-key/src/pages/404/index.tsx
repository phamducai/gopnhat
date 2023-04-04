import React from 'react'
import { Helmet } from "react-helmet";

const PageNotFound = (): JSX.Element => {
    return (
        <div className="absolute inset-0 z-30 bg-white">
            <Helmet>
                <title>404 - Page not found</title>
            </Helmet>
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="flex items-center mb-8">
                    <div className="text-2xl border-gray-400 mr-8 pr-8" style={{ borderRight: "1px solid" }}>404</div>
                    <div>This page could not be found</div>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound