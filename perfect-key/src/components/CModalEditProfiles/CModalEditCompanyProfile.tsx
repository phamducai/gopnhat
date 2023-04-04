/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from 'antd';
import CModel from 'components/CModal';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import { editProfilesStyle } from './styles/editProfiles'

interface PropsModalEditCompanyProfile {
    title: string
    visibleEditCompany: boolean;
    setVisibleEditCompany: React.Dispatch<React.SetStateAction<boolean>>;
    companyGuid: any
}

const Index = (props: PropsModalEditCompanyProfile): JSX.Element => {
    const { title, visibleEditCompany, setVisibleEditCompany, companyGuid } = props
    const classes = useStyleTheme(editProfilesStyle);

    const [companyId, setCompanyId] = useState<string>("");
    const { control } = useForm();

    const handleOk = async () => {
        companyGuid(companyId)
        setVisibleEditCompany(false);
    };

    return (
        <>
            <CModel
                visible={visibleEditCompany}
                title={title}
                onOk={handleOk}
                onCancel={() => setVisibleEditCompany(false)}
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
                                                console.log(e.target.value);
                                                setCompanyId(e.target.value)
                                            }}
                                            defaultValue={companyId}
                                            value={value}
                                            name="companyId"
                                            required
                                        />
                                    }
                                    defaultValue=""
                                    value={companyId}
                                    name="CompanyId"
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