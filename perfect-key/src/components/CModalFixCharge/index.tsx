/* eslint-disable */
import React, { useState, useEffect } from 'react';
import CModel from 'components/CModal';
import CFixChareLeft from './FixChargeLeft';
import CFixChargeRight from './FixChargeRight';
import { useForm } from 'react-hook-form';
import { ITableFixCharge } from 'common/model-booking';
import FixChargesService from 'services/booking/fixcharges.service';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { setDataFoextraCharge, setAccountNameFixCharge } from 'redux/controller/reservation.slice';
import Utils from 'common/utils';
import { addDays } from 'date-fns';
import CLoading from 'components/CLoading';
import { setTraceInHouse } from 'redux/controller/trace.slice';
import { TypeActionCode } from 'common/enum/tracer.enum';
interface PropsCharge {
    visible: boolean,
    setVisibleMFix: any,
    isEdit: boolean,
    isMain: boolean
}

const FixChargeEdit = ({ visible, setVisibleMFix, isEdit, isMain}: PropsCharge) => {
    const { handleSubmit, control,getValues,setValue } = useForm();
    const [dataTable,setDataTable] = useState<ITableFixCharge[]>([]);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { dataSelectedFixcharge,dateRsvn, dataFoextraCharge } = useSelectorRoot(state => state.rsvn);
    const { commonInforTsRoom } = useSelectorRoot(state => state.trace);
    const [isRefreshTable,setRefreshTable] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const dispatch = useDispatchRoot();
    useEffect(() => {
        const fetchData = async () =>{
            setIsLoading(true);
            const res = await FixChargesService.filterDataFixCharges(hotelId,isEdit,dataFoextraCharge);
            if(!isMain){
                setDataTable(res.tableFixCharge.filter(x => x.ma !== "304"));
            }else{
                setDataTable(res.tableFixCharge);
            }
            if(!isEdit){
                dispatch(setAccountNameFixCharge({accountName : "ACCOUNT NAME", dataSelectedFixcharge : []}));
            }
            else{
                const newDataSelected = FixChargesService.mapDataTable(res.tableFixCharge);
                dispatch(setAccountNameFixCharge({accountName : "ACCOUNT NAME", dataSelectedFixcharge : newDataSelected}))
            }
            setIsLoading(false);
        }
        fetchData();
    }, [isRefreshTable])
    const onSubmit = handleSubmit((data: any) => {
        const date = Utils.formatDateCallApi(addDays(new Date(dateRsvn.departureDate), -1));
        const resMapData = FixChargesService.mapDataFoextraCharge(dataSelectedFixcharge, date);
        dispatch(setDataFoextraCharge(resMapData));
        dispatch(setTraceInHouse({
            actionCode : TypeActionCode.FixCharge_Modify,
            objectId: commonInforTsRoom?.tsRoomId ?? 0,
            oldString: ``,
            newString: `${resMapData.totalFixCharge}`,
            oldDate: new Date(commonInforTsRoom?.arrivalDate ?? "") ?? new Date(),
            newDate: new Date(),
            hotelGuid: hotelId
        }))
        setVisibleMFix(false);
    })
    return (
        <CModel
            title="Fix Charge"
            visible={visible}
            onOk={onSubmit}
            onCancel={() => setVisibleMFix(false)}
            width={"85%"}
            style={{ top: 6 }}
            content={
                <CLoading visible={isLoading}>
                    <form onSubmit={onSubmit} id="formFixCharge">
                        <div className={`grid grid-cols-6 gap-4`}>
                            <div className={`xl:col-span-4 col-span-6 grid grid-cols-2 gap-2`}>
                                <CFixChareLeft
                                    dataTable={dataTable}
                                    control={control}
                                    getValues={getValues}
                                    setValue={setValue}
                                    isRefreshTable={isRefreshTable}
                                    setRefreshTable={setRefreshTable}
                                    isEdit={isEdit}
                                />
                            </div>
                            <div className={`xl:col-span-2 col-span-6 grid grid-cols-2 gap-2`}>
                                <CFixChargeRight
                                    getValues={getValues}
                                    control={control} />
                            </div>
                        </div>
                    </form>
                </CLoading>
            }
        />
    );
};

export default React.memo(FixChargeEdit);