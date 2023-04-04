import Avatar from 'antd/lib/avatar/avatar'
import CIconSvg from 'components/CIconSvg'
import avatar from 'image/favicon.png'
import React from 'react'
import Utils from "common/utils"
import { MailOutlined, MobileOutlined } from '@ant-design/icons'
import { Menu, Dropdown } from 'antd'
import { useHistory } from 'react-router-dom'
import { styles } from './styles/styleUser'
import { useStyleTheme } from 'theme';

function CUser(props: Props): JSX.Element {
    const classes = useStyleTheme(styles);
    const userName = Utils.getValueLocalStorage("username")
    const email = Utils.getValueLocalStorage("email")
    const phone = Utils.getValueLocalStorage("email")
    const history = useHistory()
    const location = useHistory()
    const logout = () => {
        localStorage.clear()
        history.replace('/login')
        location.go(0)
    }
    
    const renderMenuAccount = (
        <Menu className={classes.box}>
            <Menu.Item key="acc-0" className={classes.hover}>
                <div className="grid grid-cols-12 gap-4 text-xs font-bold leading-7 mt-2">
                    <div className={`${classes.center} col-span-4 justify-center`}>
                        <Avatar src={avatar} className={classes.avt} />
                    </div>
                    <div className="col-span-8">
                        <div className="font-bold text-base">{userName}</div>
                        <div className="grid grid-cols-12 gap-4 text-xs font-bold mt-2">
                            <div className={`${classes.center} font-semibold col-span-1`}>
                                <MailOutlined />
                            </div>
                            <div className={`${classes.center} font-semibold col-span-11`}>
                                <div className="font-semibold text-sm pl-2">{email}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 text-xs font-bold mt-1">
                            <div className={`${classes.center} font-semibold col-span-1`}>
                                <MobileOutlined />
                            </div>
                            <div className={`${classes.center} font-semibold col-span-11`}>
                                <div className="font-semibold text-sm pl-2">{phone}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 !pb-3 gap-4 text-xs font-bold leading-7 mt-2">
                    <div className="col-span-4">
                    </div>
                    <div className="col-span-8">
                        <div className="grid grid-cols-12 gap-4 text-xs font-bold mt-2">
                            <div className="col-span-11">
                                <button disabled className={`${classes.btn} !bg-gray-200 text-white font-bold py-2.5 px-4 rounded-md col-span-2`}>
                                    Change password
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 text-xs font-bold mt-2">
                            <div className="col-span-11">
                                <button
                                    className={`${classes.btnDanger} text-white font-bold py-2.5 px-4 rounded-md col-span-2`}
                                    onClick={logout}
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Menu.Item>
        </Menu >
    )
    return (
        <>
            <Dropdown overlay={renderMenuAccount} trigger={['click']} placement="bottomRight">
                <div className="flex items-center space-x-1 cursor-pointer">
                    <Avatar src={avatar} />
                    <div className="bg-gray-200 w-4 h-4 rounded-full flex justify-center items-center">
                        <CIconSvg name="chevron-down" svgSize="small" />
                    </div>
                </div>
            </Dropdown>
        </>
    )
}

const User = React.memo(CUser);
export default User