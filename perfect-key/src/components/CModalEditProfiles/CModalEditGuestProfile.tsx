/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from 'antd';
import CModel from 'components/CModal';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import { editProfilesStyle } from './styles/editProfiles'

interface PropsModalEditGuestProfile {
    title: string
    visibleEditGuest: boolean;
    setVisibleEditGuest: React.Dispatch<React.SetStateAction<boolean>>;
    guestGuid: any
}

const Index = (props: PropsModalEditGuestProfile): JSX.Element => {
    const { title, visibleEditGuest, setVisibleEditGuest, guestGuid } = props
    const classes = useStyleTheme(editProfilesStyle);

    const [guestId, setGuestId] = useState<string>("");
    const { control } = useForm();

    const handleOk = async () => {
        guestGuid(guestId)
        setVisibleEditGuest(false);
    };

    return (
        <>
            <CModel
                visible={visibleEditGuest}
                title={title}
                onOk={handleOk}
                onCancel={() => setVisibleEditGuest(false)}
                content={
                    <form onSubmit={handleOk}>
                        <div className="grid grid-cols-12 !pb-4 gap-2 text-xs font-bold leading-7">
                            <div className=" col-span-12">
                                <p className="m-0 font-base font-bold">ID:</p>
                                <Controller
                                    render={({ onChange, value }) =>
                                        <Input
                                            className={`${classes.input} w-full`}
                                            style={{ background: "#F5F6F7" }}
                                            onChange={(e: any) => {
                                                onChange(e)
                                                setGuestId(e.target.value)
                                            }}
                                            defaultValue={guestId}
                                            value={value}
                                            name="guestId"
                                            required
                                        />
                                    }
                                    defaultValue=""
                                    value={guestId}
                                    name="GuestId"
                                    control={control}
                                />
                            </div>
                        </div>
                    </form>
                }
            />
        </>
    );
}

export default Index;