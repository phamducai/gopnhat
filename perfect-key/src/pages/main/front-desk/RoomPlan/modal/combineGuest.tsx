/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Select, Modal } from 'antd';
import CModel from 'components/CModal';
import { useStyleTheme } from 'theme'
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import CombineGuestService from 'services/search/combine.servrice';
import { ICombineGuest } from 'common/model-rsvn';
import { styleCombineGuest } from 'pages/main/booking/searchResults/styles/styleCombineGuest';
import { useTranslation } from 'react-i18next';
import { ListCardRoomPlan } from 'common/model-inventory';
import { ListTsRoomPlan } from 'common/model-booking';
import Utils from 'common/utils';
import { updateCombineGuestRequest } from 'redux/controller';
const { Option } = Select;
const { confirm } = Modal;

interface Props{
    isVisbleCombine: boolean, 
    setIsVisbleCombine: React.Dispatch<React.SetStateAction<boolean>>, 
    selectedRows?: ListCardRoomPlan,
    ableCombine: boolean,
    dataTsRoom?: ListTsRoomPlan
}
const CombineRoomPlan = ({ isVisbleCombine, setIsVisbleCombine, selectedRows, ableCombine, dataTsRoom }: Props) => {
    const [combineTransactRoomId, setCombineTransactRoomId] = useState<string>('')
    const { roomType, allQueryParam, allMainGuest } = useSelectorRoot(state => state.booking);
    const dispatch = useDispatchRoot();
    const classes = useStyleTheme(styleCombineGuest);
    const [listCombineGuest, setListCombineGuest] = useState<ICombineGuest[]>([]);
    const [selectedRow, setSelectRow] = useState<any>({});
    const { t } = useTranslation("translation")
    useEffect(() => {
        const getTransactRoomBy = allQueryParam.find(x => x.guid === selectedRows?.guid);
        if (ableCombine) {
            if (getTransactRoomBy) {
                const listConvertCombineGuest = CombineGuestService.mapDataCombine(selectedRows?.guid ?? "", allQueryParam, roomType, allMainGuest);
                setSelectRow(getTransactRoomBy)
                setListCombineGuest(listConvertCombineGuest);
            }
        }
    }, [selectedRows, allQueryParam, allMainGuest, roomType, ableCombine])
    const handelOk = () => {
        if (selectedRow.guid && combineTransactRoomId) {
            showConfirm()
        }
        else {
            alert("You haven't selected combine guest !!")
        }
    }
    const showConfirm = () => {
        confirm({
            title: 'Do you want to Combine Guest ?',
            content: '',
            className: "custom-modal-confirm-pkm",
            onOk() {
                dispatch(updateCombineGuestRequest({ transactRoomId: selectedRow.guid, combineTransactRoomId }))
                setIsVisbleCombine(false);
            }
        });
    }
    return (
        <CModel
            title={"Combine Guest"}
            visible={isVisbleCombine}
            onOk={() => handelOk()}
            onCancel={() => setIsVisbleCombine(false)}
            content={
                <form>
                    <div className={`${classes.borderContent}`}>
                        <table className="table-fixed">
                            <tbody>
                                <tr style={{ verticalAlign: 'top' }}>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.fullname")} : </th>
                                    <td style={{ width: '40%' }}>{selectedRows?.fullNameGuestMain}</td>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.rsvnNo")} :</th>
                                    <td>{dataTsRoom?.reservation.id}</td>
                                </tr>
                                <tr style={{ verticalAlign: 'top' }}>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.arrival")} :</th>
                                    <td>{Utils.formatDateString((dataTsRoom?.arrivalDate ?? "").toString())}</td>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.departure")} :</th>
                                    <td>{Utils.formatDateString((dataTsRoom?.departureDate ?? "").toString())}</td>
                                </tr>
                                <tr style={{ verticalAlign: 'top' }}>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.roomType")} :</th>
                                    <td>{selectedRows?.roomName}</td>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.roomNumber")} :</th>
                                    <td>{selectedRows?.roomNumber}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={`col-span-12 flex justify-center my-2.5`}>
                        <span className={`${classes.text} `}>{t("BOOKING.SEARCHVALUE.combine")}</span>
                    </div>
                    <div className="col-span-12">
                        <Select
                            showSearch
                            className={`${classes.selectBackground} w-full !rounded-md`}
                            placeholder="Select combine room"
                            value={combineTransactRoomId || undefined}
                            onChange={(e) => setCombineTransactRoomId(e)}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {listCombineGuest.map((item: any) =>
                                <Option key={item.id} value={item.guid}>{`${item.fullName} / ${item.ten} / Room-${item.roomName} / RSVN No-${item.dataForeservation.id}`}</Option>
                            )}
                        </Select>
                    </div>
                </form>
            }
        />
    );
};

export default React.memo(CombineRoomPlan);