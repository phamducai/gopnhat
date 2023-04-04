/* eslint-disable */
import { IconName } from 'common/define-icon';
import { NavbarType } from 'common/define-type';
import CIconSvg from 'components/CIconSvg';
import React from 'react';
import { setNavbar } from 'redux/controller';
import { useHistory } from 'react-router-dom';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { createStyles, ThemeDefine, useStyleTheme } from 'theme';
// import { createStyles, ThemeDefine, useStyleTheme } from 'theme';

interface NavbarItem {
    name: string;
    icon: IconName;
    type: NavbarType

}
const arrItems: NavbarItem[] = [
    { name: 'Dashboard', icon: 'overview', type: 'dashboard' },
    { name: 'Booking', icon: 'booking', type: 'booking', },
    { name: 'Front Desk', icon: 'front-desk', type: 'front-desk' },
    { name: 'Cashier', icon: 'cashier', type: 'cashier' },
    { name: 'Report', icon: 'report', type: 'report' },
    { name: 'Miscellaneous', icon: 'tools', type: 'miscellaneous' },
]

const styles = createStyles((theme: ThemeDefine) => ({
    drawerItem: {
        "& .item": {
            display: "flex",
            padding: "10px 10px",
            margin: "10px auto",
            cursor: "pointer",
        },
        "& .item-active": {
            color: "blue",
        }
    }
}))

function NavbarResponsive(props: any): JSX.Element {
    const classes = useStyleTheme(styles);
    const currentNavbar = useSelectorRoot(state => state.app.navbar);
    const dispatch = useDispatchRoot();
    const history = useHistory();
    // function changeNavbarType(type: NavbarType) {
    //     if (currentNavbar !== type) {
    //         dispatch(setNavbar(type));
    //         history.push(`/main/${type}`)
    //     }
    // }
    const sendData = () => {
        props.closeDrawer();
    }
    const handleClickDrawer = (type: NavbarType) => {
        if (currentNavbar !== type) {
            dispatch(setNavbar(type))
            sendData();
            history.push(`/main/${type}`)
            // sendData();
        }

    }
    return (
        <div className={`mt-6 ${classes.drawerItem}`}>
            {arrItems.map((item) => {
                const isActive = currentNavbar === item.type;
                return (
                    <div className={isActive ? "item-active item" : "item"} key={item.type}
                        onClick={() => {
                            handleClickDrawer(item.type)
                        }}
                    >
                        <CIconSvg
                            className="mr-4"
                            name={item.icon}
                            svgSize="small"
                            colorSvg={isActive ? 'primary' : 'default'}
                        />
                        {item.name}
                    </div>
                )
            })}
        </div >
    )
}

export default NavbarResponsive