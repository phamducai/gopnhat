/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Radio } from "antd";
import { IFEGroupFolio, ITableFolio } from "common/cashier/model-cashier";
import { IParam, IPostingMove, PropsServiceCommon } from "common/cashier/model-folio";
import { IFormSearch } from "common/define-booking";
import { KeyMove } from "common/enum/cashier.enum";
import { TypeActionCode } from "common/enum/tracer.enum";
import GLobalPkm from "common/global";
import CModel from "components/CModal";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { searchRequest, searchWithQueryParam } from "redux/controller";
import { setTraceFolioRequest } from "redux/controller/trace.slice";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import CashierService from "services/cashier/cashier.service";
import FolioService from "services/cashier/folio.service";
import { useStyleTheme } from "theme";
import AnotherRoom from "./MoveComponent/AnotherRoom";
import { ListFolioCard } from "./MoveComponent/ListFolioCard";
import { styleCorrection } from "./styles/stylesCorrection";
import Move from "./Table/Move";

interface Props extends PropsServiceCommon {
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    listFolio: IFEGroupFolio[],
    selectedRowsFolio: ITableFolio[],
    fetchGroup(tsRomGuid: string): void

}
const MoveFolio = ({ isShowModal, setShowModal, listFolio, groupGuidId, selectedRowsFolio, idRsvn,...props }: Props): JSX.Element => {

    const {getDataFolio, getListGroupFolio, guestGuid, fetchGroup, roomNumber, fullName} = props
    const classes = useStyleTheme(styleCorrection);
    const { hotelId, numberOfRooms } = useSelectorRoot(state => state.app);
    const { dataSearchResults } = useSelectorRoot(state => state.booking);
    const dispatch = useDispatchRoot();
    const params: IParam = useParams();
    const { t } = useTranslation("translation");

    const [typeMove, setTypeMove] = useState<number>(0);
    const [selectedFolioKey, setSelectedFolioKey] = useState<string>("-1");
    const [isApplyGroup, setIsApplyGroup] = useState<boolean>(false);
    const [selectedGroupFolioGuid, setSelectedGroupFolioGuid] = useState<string>("");
    const [toGuestId, setToGuestId] = useState<string>("");
    const [toTsRoomId, setToTsRoomId] = useState<string>("");
    const [toRoomNo, setToRoomNo] = useState<string>("");

    const listGroupFolio = listFolio.filter(x => x.guidGroupFolio !== groupGuidId)

    useEffect(() => {
        if (typeMove === KeyMove.Folio) {
            setToGuestId("")
            setToTsRoomId("")
        } else {
            setSelectedGroupFolioGuid("")
        }
    }, [typeMove])

    const handleSearch = (formSearch: IFormSearch | any) => {
        const data = {
            pageNumber: formSearch.pageNumber,
            pageSize: formSearch.pageSize,
            hotelGuid: hotelId,
            isOnlyMainGuest: formSearch.isOnlyMainGuest,
            arrivalDates: formSearch.dateArrival,
            departureDates: formSearch.dateDeparture,
            companyAgentGuid: formSearch.companyAgent ? formSearch.companyAgent : '00000000-0000-0000-0000-000000000000',
            status: formSearch.searchBy ? Number.parseInt(formSearch.searchBy) : 5,
            rsvnCode: '',
            rsvnId: KeyMove.AnotherRoom === typeMove ? idRsvn : '00000000-0000-0000-0000-000000000000',
            rsvnNo: formSearch.rsvn,
            room: formSearch.room,
            availableDate: formSearch?.availableDate,
            profiles: {
                phone: formSearch.phone,
                passport: formSearch.passport,
                firstName: formSearch.firstName,
                guestName: formSearch.guestName
            },
            roomType: formSearch.roomType,
            groupCode: formSearch.groupCode,
            listRoomType: numberOfRooms //roomType
        }
        if (!formSearch?.firstName && !formSearch?.guestName && !formSearch?.passport && !formSearch?.phone) {
            dispatch(searchWithQueryParam({ ...data, profileIds: [] }))
        } else {
            dispatch(searchRequest(data))
        }
    }

    const handleOk = async () => {
        const listFolioGuid: string[] = selectedRowsFolio.map(item => { return item.guid })
        let data: IPostingMove = {
            fromGroupFolioId: "",
            toGroupFolioId: "",
            typeMoveFolio: 0,
            isSameAccount: false,
            listFolioId: listFolioGuid,
            toTsRoomId: GLobalPkm.defaultBytes32,
            guestId: GLobalPkm.defaultBytes32,
            toRoom: ""
        }
        if (selectedGroupFolioGuid) {
            data = {
                ...data,
                fromGroupFolioId: groupGuidId,
                toGroupFolioId: selectedGroupFolioGuid,
                typeMoveFolio: typeMove,
                isSameAccount: isApplyGroup,
            }
            await FolioService.postingMove(data)
            traceFolio("", roomNumber ?? "", roomNumber ?? "", new Date(), groupGuidId)
        } else {
            if (toTsRoomId && toGuestId) {
                const getGroupFolio = await CashierService.getFolioGroup(toTsRoomId)
                if (getGroupFolio) {
                    data = {
                        ...data,
                        fromGroupFolioId: groupGuidId,
                        toGroupFolioId: getGroupFolio[0]?.guidGroupFolio,
                        typeMoveFolio: typeMove,
                        isSameAccount: isApplyGroup,
                        toTsRoomId: toTsRoomId,
                        guestId: toGuestId,
                        toRoom: toRoomNo
                    }
                    await FolioService.postingMove(data)
                    traceFolio(toTsRoomId, roomNumber ?? "" , toRoomNo, new Date(), getGroupFolio[0]?.guidGroupFolio)
                }
            }
        }
        getDataFolio(groupGuidId)
        getListGroupFolio(params.tsRoomGuid);
        fetchGroup(params.tsRoomGuid);
        setShowModal(false)
    }
    const traceFolio = (toTsRoomId: string, oldValue: string, newValue: string, date: Date, groupFolioId: string) => {
        const data = dataSearchResults.find(x => x.guid === toTsRoomId);
        const indexGroupFolio = listFolio.find(x => x.guidGroupFolio === groupFolioId);
        dispatch(setTraceFolioRequest({
            actionCode: TypeActionCode.FolioRouting,
            objectGuid: toTsRoomId === "" ? params.tsRoomGuid : toTsRoomId,
            oldString: `From Room: ${oldValue} - Guest: ${fullName} - In Folio ${indexGroupFolio?.key ?? 1}`,
            newString: `To Room: ${newValue} - Guest: ${data ? data.fullName.name : ""}`,
            oldDate: date,
            newDate: date,
            hotelGuid: hotelId,
            parentGuid: groupFolioId
        }));
    }
    return (
        <CModel
            visible={isShowModal}
            title={<div>
                <p>{selectedRowsFolio.length} {t("CASHIER.FOLIO.numberItems")}</p>
                <Checkbox
                    className="font-bold"
                    style={{ color: "#00293B" }}
                    checked={isApplyGroup}
                    onChange={(e) => {
                        setIsApplyGroup(e.target.checked)
                    }}
                >{t("CASHIER.FOLIO.applyForAll")}</Checkbox>
            </div>}
            onCancel={() => setShowModal(false)}
            myForm="form-move"
            width={"60%"}
            style={{ top: "2%" }}
            disableBtn={selectedGroupFolioGuid !== "" || toTsRoomId || toGuestId ? false : true}
            onOk={() => handleOk()}
            content={
                <form >
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 ">
                            <Radio.Group defaultValue={typeMove}
                                value={typeMove}
                                onChange={(e) => setTypeMove(e.target.value)}
                            >
                                <Radio value={KeyMove.Folio}
                                    defaultChecked
                                    className={`${classes.titleCheckbox} flex-row items-center font-semibold`}>
                                    {t("CASHIER.FOLIO.moveOtherGuest")}
                                </Radio>
                                <Radio value={KeyMove.AnotherRoom}
                                    className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                >
                                    {t("CASHIER.FOLIO.moveOtherRoom")}
                                </Radio>
                                <Radio value={KeyMove.AnotherRsvn}
                                    className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                >
                                    {t("CASHIER.FOLIO.moveOtherRsvn")}
                                </Radio>
                            </Radio.Group>
                        </div>
                        <div className="col-span-12" style={{ height: `calc(100vh - ${300}px)` }}>
                            <div className="grid grid-cols-12 gap-4" >
                                {typeMove === KeyMove.Folio && listGroupFolio.map(folio => {
                                    return (
                                        <div key={folio.key} className="2xl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-12 sm:col-span-12 col-span-4"  >
                                            <ListFolioCard info={folio}
                                                selectedFolioKey={selectedFolioKey}
                                                setSelectedFolioKey={setSelectedFolioKey}
                                                setSelectedGroupFolioGuid={setSelectedGroupFolioGuid}
                                                borderClassName={selectedFolioKey === folio.key.toString() ? "!bg-white border-t-2 border-l-2 border-r-2 border-custom-blue" : "custom-bg-gray !pt-3"}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            {typeMove === KeyMove.AnotherRoom && <AnotherRoom handleSearch={handleSearch}
                                guestGuid={guestGuid} height={360}
                                setToGuestId={setToGuestId} setToTsRoomId={setToTsRoomId} 
                                setToRoomNo={setToRoomNo}
                            />}
                            {typeMove === KeyMove.AnotherRsvn && <Move handleSearch={handleSearch}
                                height={360} guestGuid={guestGuid}
                                setToGuestId={setToGuestId} setToTsRoomId={setToTsRoomId}
                                setToRoomNo={setToRoomNo} 
                            />}
                        </div>
                    </div>
                </form>
            }
        />
    )
}
export default React.memo(MoveFolio);