import { IFEGroupFolio, ITableFolio } from 'common/cashier/model-cashier'
import { IParam, IPostingMove } from 'common/cashier/model-folio'
import { NotificationStatus } from 'common/enum/shared.enum'
import { TypeActionCode } from 'common/enum/tracer.enum'
import GLobalPkm from 'common/global'
import CLoading from 'components/CLoading'
import openNotification from 'components/CNotification'
import React from 'react'
import { useParams } from 'react-router-dom'
import { setTraceFolioRequest } from 'redux/controller/trace.slice'
import { useDispatchRoot, useSelectorRoot } from 'redux/store'
import FolioService from 'services/cashier/folio.service'
import { FolioCard } from './FolioCard'

interface CashierFooterProps {
    listFolio: IFEGroupFolio[],
    selectedFolioKey: string,
    setSelectedFolioKey: React.Dispatch<React.SetStateAction<string>>,
    setSelectedGroupFolioGuid: React.Dispatch<React.SetStateAction<string>>
    loading: boolean,
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    isApplyGroup: boolean,
    fetchGroup(tsRomGuid: string): void
}
const FolioFooter = ({ listFolio, selectedFolioKey, setSelectedFolioKey, setSelectedGroupFolioGuid, loading,
    getDataFolio, getListGroupFolio, isApplyGroup, fetchGroup }: CashierFooterProps): JSX.Element => {
    const params: IParam = useParams();
    const fromGroupFolio = listFolio.find(x => x.key.toString() === selectedFolioKey)
    const {hotelId} = useSelectorRoot(x => x.app);
    const dispatch = useDispatchRoot();

    const dragOverRoom = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault() }

    const dropRoom = async (e: React.DragEvent<HTMLDivElement>, item: IFEGroupFolio) => {
        e.preventDefault();
        const selectedDragRows = JSON.parse(e.dataTransfer.getData("selectedDragRows"))
        selectedDragRows && handleOk(selectedDragRows, item)
    }

    const handleOk = async (selectedDragRowsFolio: ITableFolio[], ToGroupFolio: IFEGroupFolio) => {
        if (fromGroupFolio && selectedDragRowsFolio.length !== 0) {
            const listFolioId: string[] = []
            selectedDragRowsFolio.forEach((item) => {
                listFolioId.push(item.guid)
            })
            const data: IPostingMove = {
                fromGroupFolioId: fromGroupFolio.guidGroupFolio,
                toGroupFolioId: ToGroupFolio.guidGroupFolio,
                typeMoveFolio: 0,
                isSameAccount: isApplyGroup,
                listFolioId: listFolioId,
                toTsRoomId: GLobalPkm.defaultBytes32,
                guestId: GLobalPkm.defaultBytes32,
                toRoom:""
            }
            await FolioService.postingMove(data)
            dispatch(setTraceFolioRequest({
                actionCode: TypeActionCode.FolioRouting,
                objectGuid: params.tsRoomGuid,
                oldString: `From Folio ${fromGroupFolio.key}`,
                newString: `To Folio ${ToGroupFolio.key}`,
                oldDate: new Date(),
                newDate: new Date(),
                hotelGuid: hotelId,
                parentGuid: ToGroupFolio.guidGroupFolio
            }));
            fetchGroup(params.tsRoomGuid)
            getDataFolio(ToGroupFolio.guidGroupFolio)
            getListGroupFolio(params.tsRoomGuid);

            const el = document.querySelector('.shadow');
            el && el.remove();
        } else {
            openNotification(NotificationStatus.Error, " ", "Select folio wants to move");
        }
    }

    return (
        <CLoading visible={loading} className="flex justify-between gap-2 mt-4 px-7">
            {listFolio.map(folio => {
                return (
                    <div className={selectedFolioKey === folio.key.toString() ? "h-44 w-full" : "h-36 w-full"} key={folio.key}
                        id={selectedFolioKey}
                        onDrop={(e) => dropRoom(e, folio)}
                        onDragOver={(e) => dragOverRoom(e)}
                    >
                        <FolioCard
                            setSelectedFolioKey={setSelectedFolioKey}
                            wrapperClassName={selectedFolioKey === folio.key.toString() ? "!bg-white border-t-2 border-l-2 border-r-2 border-custom-blue" : "custom-bg-gray mt-8 !pt-3"}
                            info={folio}
                            isSelected={selectedFolioKey === folio.key.toString()}
                            setSelectedGroupFolioGuid={setSelectedGroupFolioGuid}
                        />
                    </div>
                )
            })}
        </CLoading>
    )
}
export default React.memo(FolioFooter);