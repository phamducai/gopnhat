import clsx from 'clsx';
import { IconName } from 'common/define-icon';
import { NavbarType, ArrayNavbar } from 'common/define-type';
import CIconSvg from 'components/CIconSvg';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { setNavbar } from 'redux/controller';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { createStyles, ThemeDefine, useStyleTheme } from 'theme';
import { useTranslation } from "react-i18next";
//import { Menu, Dropdown } from 'antd'

interface NavbarItem {
    name: string;
    icon: IconName;
    type: NavbarType

}

const styles = createStyles((theme: ThemeDefine) => ({
    'item-active': {
        borderBottomWidth: 4,
        borderTopWidth: 4,
        borderBottomColor: theme.palette.primary,
        borderTopColor: theme.palette.background,
        color: "#1A87D7 !important",
    },
    navbarSpan: {
        fontSize: 16,

    },
    navbarPage: {
        color: "#00293B",
        "& > :first-child": {
            minWidth: "60px !important",
        }

    },
    '@media (max-width: 1024px)': {
        navbarPage: {
            marginLeft: "0px !important",
            "& > :first-child": {
                minWidth: "40px !important",
            }
        }
    },
    box: {
        width: "211px",
        marginTop: 6,
        borderRadius: 10
    }

}))

function CMainNavbar(props: Props): JSX.Element {
    const classes = useStyleTheme(styles);
    const currentNavbar = useSelectorRoot(state => state.app.navbar);
    const dispatch = useDispatchRoot();
    const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation("translation")

    const arrItems: NavbarItem[] = [
        { name: '', icon: 'overview', type: 'dashboard' },
        { name: t("NAVBAR.booking"), icon: 'booking', type: 'booking' },
        { name: t("NAVBAR.frontDesk"), icon: 'front-desk', type: 'front-desk' },
        { name: t("NAVBAR.cashier"), icon: 'cashier', type: 'cashier' },
        //{ name: t("NAVBAR.channel"), icon: 'channel', type: 'channel' },
        //{ name: t("NAVBAR.roomManagement"), icon: 'room-management', type: 'room-management' },
        //{ name: t("NAVBAR.endOfDay"), icon: 'end-of-day', type: 'end-of-day' },
        { name: t("NAVBAR.report"), icon: 'report', type: 'report' },
        { name: t("NAVBAR.Miscellaneous"), icon: 'tools', type: 'miscellaneous' },
    ]

    function changeNavbarType(type: NavbarType) {
        history.push(`/main/${type}`)
    }
    function getUrlNarbar(url: string) {
        let urlNavbar = "";
        if (url === "/main") return "dashboard";
        else {
            for (let i = 0; i < ArrayNavbar.length; i++) {
                const checkItemNavbar = url.includes(ArrayNavbar[i]);
                if (checkItemNavbar) { urlNavbar = ArrayNavbar[i]; }
            }
            return urlNavbar;
        }


    }

    useEffect(() => {
        const urlNavbars = location.pathname;
        const navbar = getUrlNarbar(urlNavbars)
        dispatch(setNavbar(navbar as NavbarType));
    })


    return (
        <div className={clsx(
            `${classes.navbarPage} h-full xl:space-x-6 lg:space-x-2 flex flex-row justify-center items-center select-none`,
            props.className

        )}>
            {
                arrItems.map(item => {
                    const { name, icon, type } = item;
                    const isActive = currentNavbar === type;
                    return (
                        <div
                            key={type}
                            onClick={() => changeNavbarType(type)}
                            className={clsx(
                                ` flex flex-row justify-center items-center space-x-2  h-full cursor-pointer`,
                                { [classes['item-active']]: isActive }
                            )} style={{ minWidth: 103 }}>
                            <CIconSvg
                                name={icon}
                                svgSize="small"
                                colorSvg={isActive ? 'primary' : 'default'} />
                            {name && <span className={`${classes.navbarSpan} font-semibold`}>{name}</span>}
                        </div>
                    )
                })
            }
            {/* <Dropdown overlay={
                <Menu className={classes.box}>
                    <Menu.Item key="acc-0">
                        <div
                            onClick={() => changeNavbarType("room-management")}
                            className={clsx(
                                ` flex flex-row justify-start items-center space-x-2  h-full cursor-pointer`
                            )} style={{ minWidth: 103 }}>
                            <CIconSvg
                                name={"room-management"}
                                svgSize="small" />
                            {t("NAVBAR.roomManagement") && <span className={`${classes.navbarSpan} font-semibold`}>{t("NAVBAR.roomManagement")}</span>}
                        </div>
                    </Menu.Item>
                    <Menu.Item key="acc-0">
                        <div
                            onClick={() => changeNavbarType("end-of-day")}
                            className={clsx(
                                ` flex flex-row justify-start items-center space-x-2  h-full cursor-pointer`
                            )} style={{ minWidth: 103 }}>
                            <CIconSvg
                                name={"end-of-day"}
                                svgSize="small" />
                            {t("NAVBAR.endOfDay") && <span className={`${classes.navbarSpan} font-semibold`}>{t("NAVBAR.endOfDay")}</span>}
                        </div>
                    </Menu.Item>
                </Menu>
            } trigger={['hover']} placement="bottomLeft">
                <div className="flex items-center space-x-1 cursor-pointer">
                    <div className="bg-gray-200 w-4 h-4 rounded-full flex justify-center items-center">
                        <CIconSvg name="chevron-down" svgSize="small" />
                    </div>
                </div>
            </Dropdown> */}
        </div >
    )
}

const MainNavbar = React.memo(CMainNavbar);
export default MainNavbar