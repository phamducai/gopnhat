import React from 'react'
import ClassBox from 'components/CClassBox';
import { styleCashier } from 'pages/main/cashier/styles/styleCashier';
import { useStyleTheme } from 'theme'
import { IFEGroupFolio } from 'common/cashier/model-cashier';
import Utils from 'common/utils';
import clsx from 'clsx';

interface FolioCardProps {
    info: IFEGroupFolio,
    wrapperClassName?: string,
    setSelectedFolioKey: React.Dispatch<React.SetStateAction<string>>,
    setSelectedGroupFolioGuid: React.Dispatch<React.SetStateAction<string>>,
    isSelected: boolean
}
export const FolioCard = ({ info, wrapperClassName, setSelectedFolioKey, setSelectedGroupFolioGuid, isSelected }: FolioCardProps): JSX.Element => {
    const classes = useStyleTheme(styleCashier);

    return (
        <ClassBox onClick={() => { setSelectedFolioKey(info.key.toString()); setSelectedGroupFolioGuid(info.guidGroupFolio) }}
            className={clsx(classes.classBox, wrapperClassName, "cursor-pointer transition scale-y-50 duration-300 ease-linear w-full")} >
            {isSelected && <p className="mt-2 font-bold control-color-blue"> Active</p>}
            <div className="flex items-center justify-center flex-col">
                <label className="cursor-pointer font-semibold text-4xl mb-3">
                    {info.key}
                </label>
                <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="col-span-1 text-center">
                        <label>Debit</label>
                        <div className="text-xs font-semibold">{Utils.formatNumber(info.debit)}</div>
                    </div>
                    <div className="col-span-1 text-center">
                        <label>Credit</label>
                        <div className=" text-xs font-semibold">{Utils.formatNumber(info.credit)}</div>
                    </div>
                    <div className="col-span-1 text-center">
                        <label>Balance</label>
                        <div className={`${info.balance !== 0 ? classes.redText : classes.blueText} text-xs font-semibold`}>{Utils.formatNumber(info.balance)}</div>
                    </div>
                </div>
            </div>
        </ClassBox >
    )
}
