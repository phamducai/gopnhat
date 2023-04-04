import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Input, notification } from 'antd';
import { ForgotType } from 'common/define-type';
import CLoading from 'components/CLoading';
import background from 'image/background-login.png';
import logo from 'image/logo.svg';
import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { clearMessageResquest, forgotRequest } from 'redux/controller';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';

const containerStyle: React.CSSProperties = {
    background: `url("${background}") center center/cover no-repeat scroll`,
    backgroundSize: 'contain'
}
export default function ForgotPassword(): JSX.Element {
    const {handleSubmit, control} = useForm();
    const dispatch = useDispatchRoot();
    const {messageForgot, isSuccess, loading} = useSelectorRoot(state => state.login);
    const history = useHistory();

    useEffect(() => {
        isSuccess && history.push('/');
    }, [history, isSuccess])

    useEffect(() => {
        function showMessage(msg: string) {
            if(msg){
                notification.open({
                    message: msg,
                    placement: 'bottomRight'
                })
            }else if(msg === "success") {
                notification.open({
                    message: 'Send mail success. Please, check your email',
                    placement: 'bottomRight'
                })
            }
            dispatch(clearMessageResquest)
        }
        messageForgot && showMessage(messageForgot.Message ?? "")
    }, [dispatch, history, messageForgot])
    
    function onSubmit(data: ForgotType) {
        dispatch(forgotRequest(data.email))
    }

    return (
        <CLoading visible={loading} className="bg-primary">
            <Helmet>
                <title>Forgot Password</title>
            </Helmet>
            <div className="w-screen h-screen flex justify-start" style={containerStyle}>
                <div className="w-1/2 h-full flex flex-col justify-center items-center space-y-4 
                text-white font-bold px-4">
                    <img src={logo} alt="logo" />
                    <span className="text-xl">Perfect Key</span>
                    <div className='flex mt-8'>
                        <ArrowLeftOutlined className='text-3xl float-left cursor-pointer self-center' onClick={() => history.push("/")}/>
                        <span className="text-xl text-center" style={{width: "22rem"}}>Forgot Password</span>
                    </div>
                    <form className="space-y-4 w-96" onSubmit={handleSubmit(onSubmit)}>
                        <Controller as={
                            <Input 
                                className="bg-white !rounded h-14" 
                                prefix={
                                    <UserOutlined className="bg-primary !text-white rounded-full p-1" />
                                } 
                                placeholder="Email" />
                        } name="email" 
                        control={control} 
                        defaultValue="" 
                        />
                        <div className="flex justify-between">
                            <Button htmlType="submit" type="primary" className="!border-white !border-2 !rounded w-full !h-12">Reset Password</Button>
                        </div>
                    </form>
                </div>
            </div>
        </CLoading>
    )
}