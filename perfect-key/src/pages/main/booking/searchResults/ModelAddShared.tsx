import React, { useState, useEffect } from 'react';
import { InputNumber, notification } from 'antd';
import CModel from 'components/CModal';
import { useStyleTheme } from 'theme'
import { useSelectorRoot, useDispatchRoot } from 'redux/store';
import { IAddSharedReservation } from 'common/define-booking';
import { PostGuestProfileDTO } from 'common/model-profile';
import { POST_NEW_GUEST_PROFILE_DTO } from 'common/const/postGuestProfileDTO';
import CLoading from 'components/CLoading';
import { styleCTable } from 'components/CStyleTable';
import clsx from 'clsx';
import functionPkmApi from 'api/pkm/function.api';
import { DataFoTransactRoomDTO } from 'common/model-rsvn';
import { addSharedGuestRequest } from 'redux/controller';
import AddSharedGuestService from 'services/search/addshared.service';
import { PropsAddShared } from 'common/search/PropsAddShared';
import { IAmountGuest } from 'common/search/ModelAddShared';
import { ISearchResult } from 'common/model-booking';
import { useTranslation } from 'react-i18next';
import ProfileApi from 'api/profile/prf.api';

const ModelAddShared = ({ isVisbleAddShared, setIsVisbleAddShared, selectedRows, isApplyGroup }: PropsAddShared) => {
    const classesTable = useStyleTheme(styleCTable);
    const dispatch = useDispatchRoot();
    const { queryParam, dataSearchResults, listGuestProfiles } = useSelectorRoot(state => state.booking);
    const { hotelId } = useSelectorRoot(state => state.app)
    const [dataAmount, setDataAmout] = useState<IAmountGuest[]>([]);
    const [dataAddShared, setDataAddShared] = useState<ISearchResult[]>([]);
    const { t } = useTranslation("translation")

    useEffect(() => {
        const handelDataAddSharedGuest = () => {
            let newDataAmount: IAmountGuest[] = [];
            if (isApplyGroup && selectedRows.length === 1) {
                const resData = AddSharedGuestService.handelDataAmountApplyForGroup(selectedRows, queryParam, listGuestProfiles, dataSearchResults);
                setDataAddShared(resData.dataSearchResult);
                newDataAmount = resData.dataAmount;
            } else {
                newDataAmount = AddSharedGuestService.handelDataAmount(selectedRows, listGuestProfiles);
                setDataAddShared(selectedRows);
            }
            setDataAmout(newDataAmount);
        }
        handelDataAddSharedGuest();
    }, [selectedRows, isApplyGroup, dataSearchResults, queryParam, listGuestProfiles])

    const handelOnChange = (e: number, index: number) => {
        const temp: IAmountGuest[] = [...dataAmount];
        dataAmount.forEach((item: IAmountGuest) => {
            if (item.index === index) {
                temp[index].amount = e;
            }
        });
        setDataAmout(temp);

    }

    const addNewGuestProfile = async (dataGuestProfile: PostGuestProfileDTO) => {
        const resGuestProfile = await ProfileApi.postGuestNewProfiles(true, dataGuestProfile).toPromise();
        if (resGuestProfile) {
            return resGuestProfile.guestProfilesGuid[resGuestProfile.guestProfilesGuid.length - 1];
        };
        return false;
    }

    const handelOk = () => {
        const newArrShared: IAddSharedReservation[] = [];
        dataAmount.forEach(async (item: IAmountGuest) => {
            const resTransactRoom = await functionPkmApi.getTransactRoomByID(item.transactRoomId ?? "").toPromise();//get data transaction room by id
            const dataGuestProfile: PostGuestProfileDTO = {
                ...POST_NEW_GUEST_PROFILE_DTO,
                guestName: item.guestName,
                firstName: item.firstName,
                hotelGuid: hotelId
            } // map data new guest profile default
            delete resTransactRoom.id;
            delete resTransactRoom.guid;
            let arrSharedGuest: DataFoTransactRoomDTO[] = [];
            for (let i = 0; i < item.amount; i++) {
                const resGuestProfile = await addNewGuestProfile(dataGuestProfile);
                if (resGuestProfile) {
                    arrSharedGuest = [...arrSharedGuest, {
                        ...resTransactRoom,
                        rate: 0,
                        guestId: resGuestProfile
                    }];
                }
            }
            newArrShared.push({
                mainTrsRoom: item.transactRoomId,
                shareGuests: arrSharedGuest
            })
            if (newArrShared.length === dataAmount.length) {
                console.log(newArrShared);
                dispatch(addSharedGuestRequest({
                    addShareData: newArrShared
                }));
                setIsVisbleAddShared(false);
                notification.success({
                    message: 'Add shared guest reservation success ',
                });
            }
        });

    }

    const renderRowTable = (data: ISearchResult[]) => {
        return data?.map((item, index: number) => {
            return (
                <tr key={item.guid} className="h-12 border">
                    <td>{item.fullName.name}</td>
                    <td>{item.roomType.name}</td>
                    <td>{item.rsvnNo.name}</td>
                    <td>
                        <InputNumber min={1} defaultValue={1} name={item.rsvnNo.name?.toString()} onChange={(e) => handelOnChange(e, index)} />
                    </td>
                </tr>
            )
        })
    }

    return (
        <CModel
            title={"Add Shared To Reservation"}
            visible={isVisbleAddShared}
            onOk={() => handelOk()}
            onCancel={() => setIsVisbleAddShared(false)}
            content={
                <CLoading visible={false}>
                    <div className="table-add-shared" style={{ color: "#00293B", fontSize: 14 }}>
                        <table className={clsx(classesTable.table)} style={{ width: "100%", textAlign: "center" }}>
                            <thead className="h-12 p-0.5">
                                <tr>
                                    <th className="w-1/4">{t("BOOKING.SEARCHVALUE.fullname")}</th>
                                    <th className="w-1/4">{t("BOOKING.SEARCHVALUE.roomType")}</th>
                                    <th className="w-1/4">{t("BOOKING.SEARCHVALUE.rsvnNo")}</th>
                                    <th className="w-1/4">{t("BOOKING.SEARCHVALUE.amount")}</th>
                                </tr>
                            </thead>
                            <tbody className="p-0.5">
                                {dataAddShared ? renderRowTable(dataAddShared) : ""}
                            </tbody>
                        </table>
                    </div>
                </CLoading>
            }
        />
    );
};

export default React.memo(ModelAddShared);