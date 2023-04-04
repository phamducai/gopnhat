/* eslint-disable*/
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useStyleTheme } from 'theme';
import { Button } from "antd";
import CIconSvg from "components/CIconSvg";
import { useForm } from 'react-hook-form';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import search from 'services/search/search.service';
import { NewReservationData, RoomShortInfo, WalkInFormData } from 'common/model-rsvn';
import GuestProfileService from 'services/booking/guestprofile.service';
import ButtonHeaderRight from 'components/CButtonHeaderRight';
import CCommentArea from 'components/CCommentArea';
import { styleNewWalkIn } from './style/index.style';
import CGuestScheduleWalkin, { DirectFrom } from './CGuestScheduleWalkin';
import FormGuestProfile from 'components/CFormProfile/CFormGuest/CFormGuestProfile';
import { GuestProfileFormData } from 'common/const/guestProfileFormData';
import { PrinterOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import GUEST_PROFILE_DEFAULT_VALUE from 'common/const/guestProfileDefaultValue';
import { cloneDeep } from 'lodash';
import Utils from 'common/utils';
import CDrawerProfile from 'components/CDrawerProfile/CDrawerProfile';
import CGuestProfileWalkin from './CGuestProfileWalkin';
import { getHcfgInfoRequest } from 'redux/controller/hotelconfig.slice';
import { getGuestDetailsOptionsRequest, getGuestMoreDetailsRequest, setAccountNameFixCharge, setDataFoextraCharge } from 'redux/controller/reservation.slice';
import { GuestProfile } from 'common/model-profile';
import WalkInService from 'services/frontdesk/walk-in/walkin.services';
import PkmApi from 'api/pkm/pkm.api';
import InventoryApi from 'api/inv/inv.api';
import { setRoomType } from 'redux/controller/booking.slice';
import { RoomInfo, RoomType } from 'common/model-inventory';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
interface idRsvn {
    idRsvn: string
}
const NewWalkIn = () => {
    const history = useHistory();
    const dispatch = useDispatchRoot();
    const classes = useStyleTheme(styleNewWalkIn);
    const { filteredCompanyProfile, getBookingByRsvnId, dataFoextraCharge } = useSelectorRoot(state => state.rsvn);
    const { lstEmptyRooms } = useSelectorRoot(state => state.roomPlan);
    const { hcfgInfo } = useSelectorRoot(state => state.hotelConfig)
    const [paymentExpenses, setPaymentExpenses] = useState<string>("");
    const { handleSubmit, control, getValues, setValue } = useForm();
    const param: idRsvn = useParams();
    const showDrawer = () => {
        // setSelectKind('null');
        // setVisibleCompanyProfile(true);
        console.log('Show Drawer')
    };
    const { hotelId } = useSelectorRoot(state => state.app);
    const [visibleGuestProfile, setVisibleGuestProfile] = useState(false)
    const [changeTabs, setChangeTabs] = useState();
    const [visibleCompanyProfile, setVisibleCompanyProfile] = useState(false);
    const [btnLoadingGP, setBtnLoadingGP] = useState(false)
    const [onOkGP, setOnOkGP] = useState(false)
    const [selectKind, setSelectKind] = useState<any>('')
    const [ countOfRSVN, updateCountOfRSVN ] = useState<number>(1);
    const { user } = useSelectorRoot(state => state.login);
    const openDrawerGuestProfile = (e: boolean) => {
        dispatch(getGuestDetailsOptionsRequest(hotelId));
        dispatch(getGuestMoreDetailsRequest(hotelId));
        walkInGuestProfile !== null && setWalkInGuestProfile({ ...walkInGuestProfile, firstName: WalkInService.baseProfile.firstName, guestName: WalkInService.baseProfile.guestName });
        setVisibleGuestProfile(e);
    }
    const [walkInGuestProfile, setWalkInGuestProfile] = useState<GuestProfile | null>(GUEST_PROFILE_DEFAULT_VALUE);
    const location: any = useLocation();
    // useEffect(() => {
    //     if (id.idRsvn && id.idRsvn !== '') {
    //        console.log(getBookingByRsvnId);
    //     }else{
    //         history.push("/main")
    //     }
    // }, [id.idRsvn])

    //CGuestProfile
    const handleGuestProfile = (formData: GuestProfileFormData) => {
        //setProfileFormData(formData);
        const pre = cloneDeep(GUEST_PROFILE_DEFAULT_VALUE);
        Utils.transformData(formData.main, pre);
        Utils.transformData(formData.more, pre);
        setWalkInGuestProfile(pre);
        setValue('guestName', pre.guestName)
        setValue('firstName', pre.firstName)
        WalkInService.baseProfile.guestName = pre.guestName ?? "";
        WalkInService.baseProfile.firstName = pre.firstName ?? "";
        console.log(pre);
        if (onOkGP) {
            setBtnLoadingGP(true)
            setTimeout(() => {
                setBtnLoadingGP(false)
                setOnOkGP(false)
                setVisibleGuestProfile(true);
            }, 1000);
        }
    }

    const handleSearchFirstName = (e: { firstName: string, searchBy: number }) => {
        history.push(`search`, {
            firstName: e.firstName,
            searchBy: e.searchBy
        })
        const data = {
            hotelGuid: hotelId,
            status: e.searchBy,
            profiles: {
                phone: '',
                passport: '',
                firstName: e.firstName,
                guestName: ''
            },
            // listRoomType: roomType
        }
        // dispatch(searchRequest(data))
    }

    useEffect(() => {
        WalkInService.resetBaseProfile();
        dispatch(getHcfgInfoRequest(hotelId));
        const setRoomTypeWalkIn = async () => {
            const res: RoomType[] = await InventoryApi.invRoomtype(hotelId).toPromise() as RoomType[];
            dispatch(setRoomType({rooomType: res.filter((e: RoomType) => e.ma !== "PM")}));
        }
        setRoomTypeWalkIn();
        PkmApi.getCountOfRSVN(hotelId).subscribe(
            (res) => {
                updateCountOfRSVN(res.count);
            }
        )
    }, [hotelId])

    const findingRoomSelected = (): RoomShortInfo | null => {
        if(location?.state?.direct === DirectFrom.RoomPlan){
            return { 
                roomGuid: lstEmptyRooms[0].roomGuid,
                roomName: lstEmptyRooms[0].roomNumber?.toString()
            }
        }
        const indx = WalkInService.lstAvailableRooms.findIndex(item => item.guid === getValues('roomGuid'))
        if (indx === -1) return null;
        return { roomGuid: WalkInService.lstAvailableRooms[indx].guid, roomName: WalkInService.lstAvailableRooms[indx].so }
    }

    const validate = () => {
        return Utils.isNullOrEmpty(getValues('roomGuid'));
    }

    const convertMidday = (data: WalkInFormData) => {
        data.arrivalDate = Utils.formatDateByUTC(data.arrivalDate);
        data.departureDate = Utils.formatDateByUTC(data.departureDate);
    }

    const onSubmit = async (data: WalkInFormData) => {
        console.log(data);
        const selectedRoom = findingRoomSelected();
        if (validate() || !selectedRoom){
            openNotification(NotificationStatus.Warning, "Required information", 'Please choose Room#')
            return;
        }
        convertMidday(data);
        await WalkInService.newWalkInExec(data, walkInGuestProfile, dataFoextraCharge, selectedRoom, hotelId).then(
            (res) => {
                dispatch(setDataFoextraCharge({ totalFixCharge: 0, dataFoextraCharge: [] }));// reset data fixcharge when new success
                dispatch(setAccountNameFixCharge({ accountName: "ACCOUNT NAME", dataSelectedFixcharge: [] }));// reset data fixcharge when new success
                history.goBack();
            }
        )
    }
    return (
        <div className={`overflow-auto ${classes.main}`} style={{ height: "calc( 100vh - 64px)", color: "#00293B" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={` flex justify-between my-4`}>
                    <div className={` flex items-center justify-center`}>
                        <div className={`${classes.backSquare} cursor-pointer flex  items-center justify-center p-2 rounded`} onClick={() => {
                            history.goBack();
                        }}>
                            <CIconSvg name="back" colorSvg="origin" svgSize="small" />
                        </div>
                        <p className="m-0 text-base	font-bold ml-3">New Walk-In</p>
                    </div>
                    <div className={`flex items-center justify-center`}>
                        <div>
                            <ButtonHeaderRight active={true} title={"More Actions"} />
                        </div>
                        <div>
                            <ButtonHeaderRight active={false} title={"Folio"} />
                        </div>
                        <div>
                            <ButtonHeaderRight active={false} title={"Trace"} />
                        </div>
                        <div onClick={showDrawer}>
                            <ButtonHeaderRight active={false} title={"New Company"} />
                        </div>
                    </div>
                </div>
                <div className={`${classes.headerInfo} flex my-4 justify items-center`}>
                    <p className="mr-4 font-semibold m-0">Rsvn No: {countOfRSVN + 1}</p>
                    <p className="font-semibold m-0">User: {user?.userName ?? "User created"}</p>
                </div>
                <div className={`grid grid-cols-2 gap-4`}>
                    <div style={{ position: 'unset' }} className={`xl:col-span-1 col-span-2 grid grid-cols-1 grid-cols gap-2`}>
                        <CGuestProfileWalkin
                            openDrawerGuestProfile={openDrawerGuestProfile}
                            guestProfile={getBookingByRsvnId}
                            data={hcfgInfo}
                            getValues={getValues}
                            setValue={setValue}
                            filteredCompanyProfile={filteredCompanyProfile}
                            control={control}
                            className={`grid grid-cols-12 gap-2 xl:col-span-1 md:col-span-2 md:order-first`}
                        />
                        <CCommentArea control={control} />
                    </div>
                    <div className={`xl:col-span-1 col-span-2 grid grid-cols-1`}>
                        <CGuestScheduleWalkin
                            directFrom={location?.state?.direct}
                            data={hcfgInfo}
                            getValues={getValues}
                            setValue={setValue}
                            filteredCompanyProfile={filteredCompanyProfile}
                            control={control}
                            className={`grid grid-cols-12 gap-2 xl:col-span-1 md:col-span-2 md:order-3 xl:order-1 !py-4`}
                        />
                        <div className="xl:col-span-1 md:col-span-2 flex justify-end gap-3 py-4 md:order-last">
                            <Button style={{ color: "#F74352", border: "1px solid #F74352" }} className={`!rounded-md ${classes.buttonStyle}`} onClick={() => {
                                history.goBack();
                            }}>Close</Button>
                            <Button type="primary" htmlType="submit" disabled={location?.state?.direct === DirectFrom.RoomPlan && lstEmptyRooms.length === 0 } className={`!rounded-md ${classes.buttonStyle}`}>Submit</Button>
                        </div>
                    </div>
                </div>
            </form>
            <CDrawerProfile
                visible={visibleGuestProfile}
                title="Guest Details Information"
                propsOnChange={() => setVisibleGuestProfile(false)}
                zIndex={30}
                customFooter={
                    <div className="flex justify-between m-auto" style={{ width: 951 }}>
                        <div className={"footer-left"}>
                            <Button disabled className={`${clsx(classes.buttonFooterLeft, classes.buttonFooterLeftDisable)} flex items-center`}><div className="btn flex items-center"><PrinterOutlined className='pr-2' /> Print</div></Button>
                            <Button className={`${classes.buttonFooterLeft}`}>To ISS</Button>
                            <Button className={`${classes.buttonFooterLeft}`}>Member</Button>
                        </div>
                        <div className={"footer-right gap-1"}>
                            <Button className={`${classes.buttonFooterRight} !rounded-md`}
                                onClick={() => setVisibleGuestProfile(false)}
                                style={{ color: "#F74352", border: "1px solid #F74352" }}>Cancel</Button>
                            <Button form={changeTabs} htmlType='submit'
                                onClick={() => setOnOkGP(true)}
                                loading={btnLoadingGP}
                                className={`${classes.buttonFooterRight} !rounded-md`}
                                style={{ background: "#1A87D7", color: "white" }}>OK</Button>
                        </div>
                    </div>
                } >
                <FormGuestProfile
                    walkInProfile={walkInGuestProfile}
                    openNewCompanyOrAgent={(e: any) => {
                        setSelectKind(e)
                        setVisibleCompanyProfile(true)
                    }}
                    onSearchFirstName={(e: string) => handleSearchFirstName({ firstName: e, searchBy: 1 })}
                    valueForm={(data: GuestProfileFormData) => handleGuestProfile(data)}
                    getBookingByRsvnId={getBookingByRsvnId}
                    onChangetabs={(key: any) => setChangeTabs(key)} />

            </CDrawerProfile>
        </div>
    );
};

export default React.memo(NewWalkIn);