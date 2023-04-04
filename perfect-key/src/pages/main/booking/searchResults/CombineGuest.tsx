/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Select, Modal } from 'antd';
import CModel from 'components/CModal';
import { useStyleTheme } from 'theme'
import { useSelectorRoot } from 'redux/store';
import CombineGuestService from 'services/search/combine.servrice';
import { ICombineGuest } from 'common/model-rsvn';
import { styleCombineGuest } from './styles/styleCombineGuest';
import { PropsCombineGuest } from 'common/search/PropsCombineGuest';
import { useTranslation } from 'react-i18next';
const { Option } = Select;
const { confirm } = Modal;

const CombineSearchResults = ({ isVisbleCombine, setIsVisbleCombine, selectedRows, handleCombineGuest, ableCombine }: PropsCombineGuest) => {
    const [combineTransactRoomId, setCombineTransactRoomId] = useState<string>('')
    const { roomType, allQueryParam, allMainGuest } = useSelectorRoot(state => state.booking);
    const classes = useStyleTheme(styleCombineGuest);
    const [listCombineGuest, setListCombineGuest] = useState<ICombineGuest[]>([]);
    const [selectedRow, setSelectRow] = useState<any>({});
    const { t } = useTranslation("translation")
    useEffect(() => {
        const getTransactRoomBy = allQueryParam.find(x => x.guid === selectedRows.guid);
        if (ableCombine) {
            if (getTransactRoomBy) {
                const listConvertCombineGuest = CombineGuestService.mapDataCombine(selectedRows.guid, allQueryParam, roomType, allMainGuest);
                setSelectRow(getTransactRoomBy)
                setListCombineGuest(listConvertCombineGuest);
            }
        }
    }, [selectedRows, allQueryParam, allMainGuest])
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
                handleCombineGuest({ transactRoomId: selectedRow.guid, combineTransactRoomId })
                setIsVisbleCombine(false)
            },
            onCancel() {
            },
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
                                    <td style={{ width: '40%' }}>{selectedRows.fullName.name}</td>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.rsvnNo")} :</th>
                                    <td>{selectedRows.rsvnNo.name}</td>
                                </tr>
                                <tr style={{ verticalAlign: 'top' }}>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.arrival")} :</th>
                                    <td>{selectedRows.arrival.name}</td>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.departure")} :</th>
                                    <td>{selectedRows.departure.name}</td>
                                </tr>
                                <tr style={{ verticalAlign: 'top' }}>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.roomType")} :</th>
                                    <td>{selectedRows.roomType.name}</td>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.roomNumber")} :</th>
                                    <td>{selectedRows.room.name}</td>
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

export default React.memo(CombineSearchResults);