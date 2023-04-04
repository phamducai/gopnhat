import React from "react";
import { useStyleTheme } from "theme";
import ClassBox from "components/CClassBox";
import gridIcon from "image/dashboard_grid.svg";
import houseIcon from "image/dashboard_house.svg";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { styleFrontDeskDashBoard } from "./style/styleFrontDesk";
import { useSelectorRoot } from "redux/store";

const CFrontDesk = (props: Props): JSX.Element => {
    const classes = useStyleTheme(styleFrontDeskDashBoard);
    const { t } = useTranslation("translation")
    const { listStatisticGuest } = useSelectorRoot(state => state.frontdesk)
    const history = useHistory();
    
    const actualArrival = listStatisticGuest.arrivals?.expected.room / (listStatisticGuest.arrivals?.expected.room + listStatisticGuest.arrivals?.actual.room)
    const widhProgress = actualArrival ? (actualArrival * 100).toFixed(2) : 0

    const handelClickRoomPlan = () => {
        history.push({ pathname: "/main/front-desk/room-plan" });
    }
    const handelClickRoomRack = () => {
        history.push({ pathname: "/main/front-desk/room-rack" });
    }

    return (
        <ClassBox title={t("DASHBOARD.frontDesk")} className={props.className}>
            <div className={`${classes.title}`}>{t("DASHBOARD.arrivals")}</div>
            <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-5">
                <div className={`col-span-1`} >
                    <div className={`${classes.contentText}`}>{t("DASHBOARD.expected")}:   
                        <span className={classes.contentTextBold}>   
                            {" " + listStatisticGuest.arrivals?.expected.room } {t("DASHBOARD.rms")} / {listStatisticGuest?.arrivals?.expected.guest } {t("DASHBOARD.guests")}
                        </span>
                    </div>
                    <div className={`${classes.contentText}`}>{t("DASHBOARD.actual")}:  
                        <span className={classes.contentTextBold}> 
                            {" " + listStatisticGuest.arrivals?.actual.room } {t("DASHBOARD.rms")} / {listStatisticGuest?.arrivals?.actual.guest } {t("DASHBOARD.guests")}
                        </span>
                    </div>
                    <div className={`${classes.progressParent} flex items-end w-full`}>
                        <div className={`${classes.progressChild}`} style={{ width: `${widhProgress}%` }}>
                            {`${widhProgress}%`}
                        </div>
                    </div>
                </div>
                <div className={`col-span-1`} >
                    <div className="grid sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2 gap-1">
                        <button className={`${classes.btn} text-white font-bold py-2 px-4 rounded flex justify-center col-span-2`}
                            onClick={handelClickRoomPlan}
                        >
                            <img src={houseIcon} className="px-3" alt="" />
                            {t("DASHBOARD.roomPlan")}
                        </button>
                        <button className={`${classes.btn} text-white font-bold py-2 px-4 rounded  flex justify-center col-span-2`}
                            onClick={handelClickRoomRack}
                        >
                            <img src={gridIcon} className="px-3" alt="" />
                            {t("DASHBOARD.roomRack")}
                        </button>
                    </div>
                </div>
            </div>
        </ClassBox>
    )
}

export default React.memo(CFrontDesk)