/* eslint-disable */
import CModel from "components/CModal";
import CTableMember from "components/CTable/CTableMember";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { GuestProfile, GuestProfileForRoomingList } from "common/model-profile";
import GuestProfileService from 'services/booking/guestprofile.service';
import { updateQueryParamStatus } from 'redux/controller/booking.slice';
import CLoading from "components/CLoading";
import openNotification from "components/CNotification";
import { NotificationStatus } from "common/enum/shared.enum";
import InputRoomingListService from "services/booking/input-rooming-list/input-rooming-list.service";
import { setLoading } from 'redux/controller';
import Utils from "common/utils";
import { readExcelRequest } from 'redux/controller';

interface PropsInputRoomingList {
    modalInputRoomingVisible: boolean;
    toggleShowModal?: any;
    toggleModalInputRooming: any;
    rsvnId?: string | null;
    getInHouse: boolean,
    loadData?: any,
    isInFrontDesk?: any
}
/* interface GuestInfo {
    birthday: string;
    firstName: string;
    lastName: string;
    nationality: string;
    passport: string;
    title: string;
} */

const ModalInputRoomingList = ({
    modalInputRoomingVisible,
    toggleModalInputRooming,
    rsvnId,
    getInHouse,
    isInFrontDesk,
    loadData
}: PropsInputRoomingList): JSX.Element => {
    const [dataInputRooming, setDataInputRooming] = useState<any[]>([]);
    const [dataResult, setDataResult] = useState<GuestProfile[]>([]);

    const { roomType, companyAgent, listGuestProfiles, listRoomingFromFile, loading } = useSelectorRoot(state => state.booking);
    const listGuestRoomPlan = useSelectorRoot(state => state.roomPlan.listGuestProfile);
    const { guestDetailOptions } = useSelectorRoot(state => state.rsvn);
    const { hotelId } = useSelectorRoot(state => state.app);
    const dispatch = useDispatchRoot();

    const handleOk = async () => {
        const data: GuestProfileForRoomingList[] = [];
        dataResult.map(dt => data.push({
            firstName: dt.firstName,
            guestName: dt.guestName,
            titlesGuid: dt.titlesGuid,
            passport: dt.passport,
            birthDay: dt.birthDay,
            nationalityGuid: dt.nationalityGuid,
            guid: dt.guid
        }))
        const updateRes = await GuestProfileService.updateListProfiles(data);
        if (updateRes) {
            toggleModalInputRooming(false);
            !isInFrontDesk && dispatch(updateQueryParamStatus(true));
            isInFrontDesk && loadData();
        }
    };

    const handleCancel = () => {
        toggleModalInputRooming(false);
        dispatch(readExcelRequest({}));
    };
    const getHeaderObj = (array: any[]) => {
        let result: any = {};

        array.forEach((obj: any[], index) => {
            obj.forEach((value, i: number) => {
                if (index === 0) {
                    result = { ...result, [obj[i]]: "" };
                }
            })
        })
        return result;
    }
    const updateInitData = () => {
        if (listRoomingFromFile.length === dataInputRooming.length + 1) {
            dispatch(setLoading(true));
            const data: any[] = [];
            let tmp = getHeaderObj(listRoomingFromFile);

            listRoomingFromFile.forEach((obj: any[], index) => {
                obj.forEach((value, i: number) => {
                    if (index !== 0 && i !== 0) {
                        switch (i) {
                            case 1:
                                tmp = { ...tmp, firstName: value }
                                break;
                            case 2:
                                tmp = { ...tmp, lastName: value }
                                break;
                            case 3:
                                tmp = { ...tmp, passport: value }
                                break;
                            case 4:
                                tmp = { ...tmp, birthday: value }
                                break;
                            case 5:
                                tmp = { ...tmp, title: value }
                                break;
                            case 6:
                                tmp = { ...tmp, nationality: value }
                                break;
                            default:
                                break;
                        }
                    }
                })
                data.push(tmp);
                tmp = getHeaderObj(listRoomingFromFile);
            })
            data.shift();
            const updated = dataInputRooming.map((dt, index) => {
                return {
                    ...dt,
                    firstName: data[index].firstName,
                    guestName: data[index].lastName,
                    nationalityGuid: guestDetailOptions?.nationality.find(x => x.ten === data[index].nationality)?.guid ?? null,
                    titlesGuid: guestDetailOptions?.guestTitle.find(x => x.ten === data[index].title)?.guid ?? null,
                    passport: data[index].passport,
                    birthDay: data[index].birthday
                }
            })
            setDataInputRooming(updated);
            dispatch(setLoading(false));
        }
        else {
            openNotification(NotificationStatus.Error, "Failed", "Invalid file for this rsvn/group!")
        }
    }

    useEffect(() => {
        if (modalInputRoomingVisible)
            if (listRoomingFromFile && listRoomingFromFile.length > 0)
                updateInitData()
    }, [listRoomingFromFile])

    const getData = async () => {
        if (rsvnId) {
            const listGuest = [...listGuestRoomPlan, ...listGuestProfiles];
            let status = 5;
            getInHouse ? status = 1 : status = 5;
            const data = await InputRoomingListService.getInitData(rsvnId, roomType, companyAgent, listGuest, getInHouse, hotelId, status)
            data && setDataInputRooming(data);
        }
    }
    useEffect(() => {
        if (modalInputRoomingVisible && rsvnId) {
            getData()
        }
    }, [modalInputRoomingVisible]);

    return (
        <React.Fragment>
            <CModel
                visible={modalInputRoomingVisible}
                title="Input Rooming List"
                onOk={handleOk}
                onCancel={handleCancel}
                width="1200px"
                showFromExcel
                content={
                    <form>
                        <div className="grid xl:grid-cols-12 col-span-12 pt-4 md:w-11/12 xl:w-full">
                            <div className="col-span-12" style={{ marginTop: 10 }}>
                                {dataInputRooming.length > 0 && (
                                    <CLoading visible={loading}>
                                        <CTableMember
                                            dataMembers={dataInputRooming}
                                            setDataResult={setDataResult}
                                        />
                                    </CLoading>
                                )}
                            </div>
                        </div>
                    </form>
                }
            />
        </React.Fragment>
    );
};

export default ModalInputRoomingList;
