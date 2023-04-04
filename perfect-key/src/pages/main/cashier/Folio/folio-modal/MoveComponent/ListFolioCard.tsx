import React, { useState } from 'react'
import ClassBox from 'components/CClassBox';
import { styleCashier } from 'pages/main/cashier/styles/styleCashier';
import { useStyleTheme } from 'theme'
import { IFEGroupFolio } from 'common/cashier/model-cashier';
import Utils from 'common/utils';
import useWindowSize from 'hooks/useWindowSize';
import FolioService from 'services/cashier/folio.service';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface FolioCardProps {
    info: IFEGroupFolio,
    setSelectedFolioKey: React.Dispatch<React.SetStateAction<string>>,
    setSelectedGroupFolioGuid: React.Dispatch<React.SetStateAction<string>>,
    borderClassName?: string,
    selectedFolioKey: string
}
export const ListFolioCard = ( { info, setSelectedFolioKey, setSelectedGroupFolioGuid, borderClassName, selectedFolioKey}: FolioCardProps): JSX.Element => {
    const classes = useStyleTheme(styleCashier);
    const size = useWindowSize();
    const { t } = useTranslation("translation");

    const [sizeFolio] = useState<string>(FolioService.getSizeFolioCard(size));
    const [isDoubleClick, setIsDoubleClick] = useState<boolean>(false);

    const handleSelectGroupFolio = () => {
        if(selectedFolioKey === info.key.toString()) {
            setIsDoubleClick(true)
            setSelectedFolioKey("");
            setSelectedGroupFolioGuid("");
        }else {
            setIsDoubleClick(false)
            setSelectedFolioKey(info.key.toString());
            setSelectedGroupFolioGuid(info.guidGroupFolio);
        }
    }
    return (
        <ClassBox 
            onClick={() => {handleSelectGroupFolio()}} 
            className={clsx(classes.classBox, isDoubleClick ? "custom-bg-gray !pt-3" : borderClassName, "cursor-pointer")} >
            <div className="flex items-center justify-center flex-col" style={{height: sizeFolio}}>
                <label className=" font-semibold text-4xl mb-3">
                    {info.key}
                </label>
                <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="col-span-1 text-center">
                        <label>{t("CASHIER.FOLIO.debit")}</label>
                        <div className="text-xs font-semibold">{Utils.formatNumber(info.debit)}</div>
                    </div>
                    <div className="col-span-1 text-center">
                        <label>{t("CASHIER.FOLIO.credit")}</label>
                        <div className=" text-xs font-semibold">{Utils.formatNumber(info.credit)}</div>
                    </div>
                    <div className="col-span-1 text-center">
                        <label>{t("CASHIER.FOLIO.balance")}</label>
                        <div className={`${info.balance !== 0 ? classes.redText : classes.blueText} text-xs font-semibold`}>
                            {Utils.formatNumber(info.balance)}
                        </div>
                    </div>
                </div>
            </div>
        </ClassBox >
    )
}
