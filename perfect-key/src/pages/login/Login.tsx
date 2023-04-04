import React, { useEffect, useState } from 'react';
import background from 'image/background-login.png';
import logo from 'image/logo.svg';
import { Button, Input, Checkbox, notification } from 'antd';
import {UserOutlined, LockOutlined, EyeInvisibleFilled, EyeFilled} from '@ant-design/icons';
import { Controller, useForm } from 'react-hook-form';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Login as LoginType } from 'common/define-type';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { clearMessageResquest, loginRequest } from 'redux/controller';
import CLoading from 'components/CLoading';
import { useHistory } from 'react-router-dom';
import { Helmet } from "react-helmet";

const containerStyle: React.CSSProperties = {
    background: `url("${background}") center center/cover no-repeat scroll`,
    backgroundSize: 'contain'
}
export default function Login(): JSX.Element {
    const {handleSubmit, control} = useForm();
    const [remember, setRemember] = useState<boolean>(false);
    const dispatch = useDispatchRoot();
    const {message, isSuccess, loading} = useSelectorRoot(state => state.login);
    const history = useHistory();
    const [visiblePassword, setVisiblePassword] = useState<boolean>(false); 
    useEffect(() => {
        isSuccess && history.push('/welcome');
    }, [history, isSuccess])

    useEffect(() => {
        function showMessage(msg: string) {
            if(msg === 'The login name is not exists.'){
                notification.open({
                    message: 'The username is not exists.',
                    placement: 'bottomRight'
                })
            }else {
                notification.open({
                    message: 'Password is wrong.',
                    placement: 'bottomRight'
                })
            }
            dispatch(clearMessageResquest)
        }
        message && showMessage(message.content)
    }, [dispatch, message])

    function onSubmit(data: LoginType) {
        const dataApi = {...data, remember: remember}
        dispatch(loginRequest(dataApi))
        // dispatch(selectHotel({ hotelName: "aaa", hotelId: "3fa85f64-5717-4562-b3fc-2c963f66afa6" }));
        // history.push('/main');
    }
    function onChangeRemember(event: CheckboxChangeEvent) {
        setRemember(event.target.checked)
    }

    return (
        <CLoading visible={loading} className="bg-primary">
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div className="w-screen h-screen flex justify-start" style={containerStyle}>
                <div className="w-1/2 h-full flex flex-col justify-center items-center space-y-4 
                text-white font-bold px-4">
                    <img src={logo} alt="logo" />
                    <span className="text-xl">Perfect Key</span>
                    <span className="text-lg text-center w-96">The most professional software for hospitality in Vietnam.</span>
                    <form className="space-y-4 w-96" onSubmit={handleSubmit(onSubmit)}>
                        <Controller as={
                            <Input 
                                className="bg-white !rounded h-14" 
                                prefix={
                                    <UserOutlined className="bg-primary !text-white rounded-full p-1" />
                                } 
                                placeholder="Email/username" />
                        } name="loginName" 
                        control={control} 
                        defaultValue="" />
                        <Controller as={
                            <Input 
                                className="bg-white !rounded h-14" 
                                prefix={
                                    <LockOutlined className="bg-primary !text-white rounded-full p-1" />
                                } 
                                suffix={
                                    visiblePassword ? 
                                        <EyeFilled className="cursor-pointer" onClick={() => setVisiblePassword(false)} /> :
                                        <EyeInvisibleFilled className="cursor-pointer" onClick={() => setVisiblePassword(true)} />
                                } 
                                placeholder="Password" 
                                type={visiblePassword ? 'text' : 'password'} />
                        } name="password" control={control} defaultValue="" />
                        <div className="flex justify-between">
                            <Checkbox className="!text-white" checked={remember} onChange={onChangeRemember}>Remember</Checkbox>
                            <span className="cursor-pointer" onClick={() => history.push("/forgotPassword")}>Forgot Password?</span>
                        </div>
                        <Button htmlType="submit" type="primary" className="!border-white !border-2 !rounded w-full !h-12">Sign In</Button>
                    </form>
                </div>
            </div>
        </CLoading>
    )
}