import React, { useState } from 'react';
import LeftNavbar from './LeftNavbar';
import MainNavbar from './MainNavbar';
import RightNavbar from './RightNavbar';
import { Drawer } from "antd";
import NavbarResponsive from './NavbarResposive';
import { UnorderedListOutlined } from "@ant-design/icons";

function CNavbar(): JSX.Element {
    const [drawerShow, setdrawerShow] = useState(false);
    const closeDrawer = () => {
        setdrawerShow(false);
    }
    return (
        <div style={{ boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)' }}
            className="h-16 bg-white w-full grid grid-cols-12 lg:justify-center justify-between items-center z-20">
            <LeftNavbar className="xl:col-span-3 lg:col-span-3 col-span-8 whitespace-nowrap overflow-hidden" />
            <MainNavbar className="xl:col-span-6 lg:col-span-7 lg:flex hidden" />
            <RightNavbar className="xl:col-span-3 lg:col-span-2 col-span-3 lg:flex" />
            <div className={`lg:hidden col-span-1 flex items-center`}>
                <Drawer visible={drawerShow}
                    onClose={() => { setdrawerShow(false) }}
                >
                    <NavbarResponsive closeDrawer={closeDrawer} />
                </Drawer>
                <UnorderedListOutlined style={{ fontSize: 26, cursor: "pointer" }} onClick={() => {
                    setdrawerShow(true)
                }} />
            </div>
        </div>
    )
}

const Navbar = React.memo(CNavbar);
export default Navbar