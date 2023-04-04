import React, { useEffect } from 'react';
import { Dropdown, Menu } from 'antd';
import clsx from 'clsx';
import { IHotel as Hotel } from "common/define-type";
import CIconSvg from 'components/CIconSvg';
import logo from 'image/logo.svg';
import { getListHotelRequest, selectHotel } from 'redux/controller';
import { useHistory } from "react-router";
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { createStyles, ThemeDefine, useStyleTheme } from 'theme';
import Utils from 'common/utils';
import { fetchNumberOfRooms } from 'redux/controller/reservation.slice';
import ClassBox from 'components/CClassBox';
const styles = createStyles((theme: ThemeDefine) => ({
    iconLeft: {
        "@media (max-width:1024px)": {
            display: "none !important"
        }
    },
    titleHotel: {
        '&:hover': {
            backgroundColor: '#e6f7ff',
        }
    }
}))
function CLeftNavbar({ className }: Props): JSX.Element {
    const { listHotel } = useSelectorRoot(state => state.hotel)
    const hotel = useSelectorRoot(state => state.app.hotelName);
    const classes = useStyleTheme(styles);
    const history = useHistory();
    const dispatch = useDispatchRoot();
    const guestId = "9ac100c8-34ed-4ec3-9403-91e6c33379c2"

    useEffect(() => {
        dispatch(getListHotelRequest(guestId));
    }, [dispatch])

    function handleSelectHotel(data: Hotel) {
        dispatch(selectHotel(data));
        Utils.setLocalStorage("organizationId", data.organizationId);
        dispatch(fetchNumberOfRooms({
            hotelGuid: data.hotelId
        }))
        history.push("/main")
    }

    const renderMenuItem = (
        <ClassBox className={`custom-scrollbar-pkm h-60`}>
            <Menu className='!border-0'>
                {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    listHotel.map((item: any, index) => {
                        return (
                            <Menu.Item key={index} className={`${classes.titleHotel} `} onClick={() => handleSelectHotel({ hotelName: item?.hotelName, hotelId: item?.guid, businessDate: item?.businessDate, lastNightAudit: item?.lastNightAudit, organizationId: item?.organizationId })}>
                                <div key={index} className={`flex items-center justify-between space-x-3 `}>
                                    <span >{item?.hotelName}</span>
                                </div>
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        </ClassBox>
    )
    return (
        <div className={
            clsx(
                'flex justify-start items-center ml-4 space-x-3',
                className
            )
        }>
            <img src={logo} alt="logo" className={`${classes.iconLeft} h-10`} />
            <div className="flex flex-col">
                <span className="text-black-1-pkm font-bold opacity-40">Perfect Key</span>
                <Dropdown overlay={renderMenuItem} trigger={['click']} placement="bottomLeft">
                    <div className="text-primary space-x-1 flex items-center font-bold text-base cursor-pointer">
                        <span className="overflow-hidden">{hotel}</span>
                        <CIconSvg name="chevron-down" svgSize="small" colorSvg="primary" />
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

const LeftNavbar = React.memo(CLeftNavbar);
export default LeftNavbar