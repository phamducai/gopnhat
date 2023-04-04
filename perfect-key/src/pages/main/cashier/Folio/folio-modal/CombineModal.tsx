import { Input } from 'antd';
import { ITableFolio } from 'common/cashier/model-cashier';
import { ICombineFolio } from 'common/cashier/model-folio';
import { TypeActionCode } from 'common/enum/tracer.enum';
import Utils from 'common/utils';
import CModel from 'components/CModal';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { setTraceFolioRequest } from 'redux/controller/trace.slice';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import FolioService from 'services/cashier/folio.service';
import { useStyleTheme } from 'theme';
import { styleCorrection } from './styles/stylesCorrection';

interface PropsRebate {
    isCombine: boolean;
    setIsCombine: React.Dispatch<React.SetStateAction<boolean>>,
    isApplyGroup: boolean,
    selectedRowsFolio: ITableFolio[],
    isAllItem: boolean,
    groupFolioId: string,
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    tsRoomGuid: string
    fetchGroup(tsRomGuid: string): void,
    indexGroupFolio: number
}

export const Combine = ({ tsRoomGuid, setIsCombine, isCombine, isApplyGroup, selectedRowsFolio, isAllItem, groupFolioId, getDataFolio, getListGroupFolio, fetchGroup, indexGroupFolio }: PropsRebate): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { handleSubmit, control } = useForm();
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const { hotelId } = useSelectorRoot(x => x.app);
    const dispatch = useDispatchRoot();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = handleSubmit(async ({ ghiChu }) => {
        setIsLoading(true);
        const listFolioGuid: string[] = [];
        selectedRowsFolio.forEach((item) => {
            listFolioGuid.push(item.guid);
        })
        const dataCombine: ICombineFolio = {
            groupFolioId: groupFolioId,
            isChild: isApplyGroup,
            isAllItem: isAllItem,
            description: ghiChu,
            ngayThang: Utils.formatDateCallApi(new Date(businessDate)),
            listFolioId: listFolioGuid
        }
        await FolioService.combineFolio(dataCombine);
        traceFolio(isApplyGroup, isAllItem, ghiChu);
        fetchGroup(tsRoomGuid);
        setIsLoading(false);
        getDataFolio(groupFolioId);
        getListGroupFolio(tsRoomGuid)
        setIsCombine(false);
    })
    
    const traceFolio =(isChild: boolean, isAllItem: boolean, description: string)=> {
        const listMatk = selectedRowsFolio.map(x => {
            return x.maTk
        }).join(",")
        let oldString = isChild ? `Combine all by No = ${selectedRowsFolio[0].maTk}` : `Combine ${listMatk}`;
        oldString = isAllItem ? "Combine all folio" : oldString;
        console.log(oldString);
        dispatch(setTraceFolioRequest({
            actionCode: TypeActionCode.FolioCombine,
            objectGuid: tsRoomGuid,
            oldString: `In Folio ${indexGroupFolio} - ${oldString}`,
            newString: `In Folio ${indexGroupFolio} - ${description}`,
            oldDate: new Date(),
            newDate: new Date(),
            hotelGuid: hotelId,
            parentGuid: groupFolioId
        }));
    }
    return (
        <CModel
            visible={isCombine}
            title={t("CASHIER.FOLIO.combine")}
            onOk={() => console.log("")}
            onCancel={() => setIsCombine(false)}
            myForm="form-combine"
            isLoading={isLoading}
            content={
                <form onSubmit={onSubmit} id="form-combine">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <label className="m-0 font-base font-bold">
                                {t("CASHIER.FOLIO.description")}:
                            </label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <Input
                                        className={`${classes.input}`}
                                        type="text" style={{ background: "#F5F6F7", height: 40 }}
                                        value={value}
                                        required={true}
                                        onChange={(e) => {
                                            onChange(e.target.value)
                                        }} >
                                    </Input>}
                                name="ghiChu" control={control} defaultValue={""} />
                        </div>
                    </div>
                </form>
            }
        />
    );
}
