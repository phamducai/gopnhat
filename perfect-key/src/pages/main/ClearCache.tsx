/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import packageJson from "../../../package.json";
import moment from "moment";

const buildDateGreaterThan = (latestDate: moment.MomentInput, currentDate: moment.MomentInput) => {
    const momLatestDateTime = moment(latestDate);
    const momCurrentDateTime = moment(currentDate);

    if (momLatestDateTime.isAfter(momCurrentDateTime)) {
        return true;
    } else {
        return false;
    }
};

function withClearCache(Component: any) {
    function ClearCacheComponent(props: JSX.IntrinsicAttributes){
        const [isLatestBuildDate, setIsLatestBuildDate] = useState(false);
        useEffect(() => {
            fetch("/meta.json")
                .then((response) => response.json())
                .then((meta) => {
            
                    const latestVersionDate = meta.buildDate;
                    const currentVersionDate = packageJson.buildDate;
    
                    const shouldForceRefresh = buildDateGreaterThan(
                        latestVersionDate,
                        currentVersionDate
                    );
                    if (shouldForceRefresh) {
                        setIsLatestBuildDate(false);
                        refreshCacheAndReload();
                    } else {
                        setIsLatestBuildDate(true);
                    }
                });
        }, []);
    
        const refreshCacheAndReload = () => {
            if (caches) {
                // Service worker cache should be cleared with caches.delete()
                caches.keys().then((names) => {
                    for (const name of names) {
                        caches.delete(name);
                    }
                });
            }
            localStorage.clear();
            // delete browser cache and hard reload
            window.location.reload();
        };
        return (
            isLatestBuildDate ? <Component {...props} />  : null
        )
        
    }
    return ClearCacheComponent;
}

export default withClearCache;
