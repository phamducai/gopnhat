/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from 'antd';
import { ITableMoveFolio } from "common/cashier/model-folio";
import { IFormSearch } from "common/define-booking";
import CTableQuickSearch from "components/CTable/CTableQuickSearch";
import useWindowSize from "hooks/useWindowSize";
import { styleCashier } from "pages/main/cashier/styles/styleCashier";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import CashierService from "services/cashier/cashier.service";
import { useStyleTheme } from "theme";

interface Props {
    height: number,
    handleSearch(formSearch: IFormSearch | any): void,
    guestGuid: string,
    setToGuestId : React.Dispatch<React.SetStateAction<string>>,
    setToTsRoomId: React.Dispatch<React.SetStateAction<string>>,
    setToRoomNo: React.Dispatch<React.SetStateAction<string>>,
}
const Move = ({ height, handleSearch, guestGuid, setToGuestId, setToTsRoomId, setToRoomNo }: Props): JSX.Element => {
    const classesTable = useStyleTheme(styleCashier);
    const { handleSubmit, control} = useForm();
    const size = useWindowSize();
    const { t } = useTranslation("translation");

    const [pageSize, setPageSize] = useState<number>(CashierService.getPageSizeMove(size));
    const [pageNumber, setPageNumber] = useState<number>(1);
    
    useEffect(() => {
        const newPageSize = CashierService.getPageSizeMove(size)
        setPageSize(newPageSize);
    }, [size])

    useEffect(() => {
        handleSubmitSearch()
    }, [pageNumber, pageSize])

    const handleSubmitSearch = handleSubmit (async (formSearch: IFormSearch | any) => {
        const dataSearch: IFormSearch = {
            pageNumber: pageNumber,
            pageSize:  pageSize,
            room: "",
            isOnlyMainGuest: false,
            searchBy: "1",
            rsvn: formSearch.rsvn,
            id: "",
            groupCode: "",
            dateArrival: undefined,
            companyAgent: "",
            dateDeparture: undefined,
            phone: formSearch.phone,
            passport: formSearch.passport,
            firstName: formSearch.firstName,
            guestName: formSearch.guestName
        }
        handleSearch(dataSearch)
    })
    
    const handleSelectGuest =(selectedRows: ITableMoveFolio[]) => {
        setToGuestId(selectedRows[0]?.guestId)
        setToTsRoomId(selectedRows[0]?.guid)
        setToRoomNo(selectedRows[0]?.roomName ?? "")
    }

    return (
        <div>
            <form className="custom-scrollbar-pkm" onSubmit={handleSubmitSearch} id="form-move-table">
                <div className="grid grid-cols-12 gap-2 mb-4">
                    <div className="col-span-3">
                        <label className="m-0 font-base font-bold">
                            {t("BOOKING.rsvnId")}
                        </label>
                        <Controller
                            name="rsvn"
                            render={({ onChange, value }) => <Input
                                className={`${classesTable.input}`}
                                type="number" style={{ background: "#F5F6F7", height: 40 }}
                                value={value}
                                onChange={(e) => { 
                                    onChange(e)
                                }} 
                            />}
                            control={control} defaultValue={""} />
                    </div>
                    <div className="col-span-3">
                        <label className="m-0 font-base font-bold">
                            {t("BOOKING.RESERVATION.FORMGUESTPROFILE.firstname")}:
                        </label>
                        <Controller
                            name="firstName"
                            render={({ onChange, value }) =>
                                <Input
                                    className={`${classesTable.input}`}
                                    type="text" style={{ background: "#F5F6F7", height: 40 }}
                                    value={value}
                                    onChange={(e) => { 
                                        onChange(e)
                                    }} 
                                />}
                            control={control} defaultValue={""} />
                    </div>
                    <div className="col-span-3">
                        <label className="m-0 font-base font-bold">
                            {t("BOOKING.RESERVATION.FORMGUESTPROFILE.lastname")}:
                        </label>
                        <Controller
                            name="guestName"
                            render={({ onChange, value }) =>
                                <Input
                                    className={`${classesTable.input}`}
                                    type="text" style={{ background: "#F5F6F7", height: 40 }}
                                    value={value}
                                    onChange={(e) => { 
                                        onChange(e.target.value)
                                    }} 
                                />}
                            control={control} defaultValue={""} />
                    </div>
                    <div className="col-span-2">
                        <label className="m-0 font-base font-bold">
                            {t("BOOKING.RESERVATION.FORMGUESTPROFILE.passport")}:
                        </label>
                        <Controller
                            name="passport"
                            render={({ onChange, value }) =>
                                <Input
                                    className={`${classesTable.input}`}
                                    type="number" style={{ background: "#F5F6F7", height: 40 }}
                                    value={value}
                                    onChange={(e) => { 
                                        onChange(e.target.value)
                                    }} 
                                />}
                            control={control} defaultValue={""} />
                    </div>
                    <div className="col-span-1">
                        <label className="m-0 font-base w-full" style={{color: "white"}}>world</label>
                        <Button
                            type="primary" htmlType="button"
                            className={`!rounded-md`}
                            style={{height: '40px'}}
                            onClick={() => handleSubmitSearch()}
                        >
                            {t("BOOKING.RESERVATION.ok")}
                        </Button>
                    </div>
                </div>
            </form>
            <CTableQuickSearch
                height={height}
                handleSelectGuest={handleSelectGuest}
                guestGuid={guestGuid}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
            />
        </div>
    )
}
export default React.memo(Move);