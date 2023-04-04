/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import { DraggableData, Position, ResizableDelta, Rnd, RndDragEvent } from "react-rnd";
import { useSelectorRoot } from "redux/store";
import { addDays, differenceInCalendarDays } from 'date-fns'
import { Popover } from 'antd';
import { DraggableEvent } from "react-draggable";
import Utils from "common/utils";
import RoomRackService from "services/frontdesk/roomrack.service";
import { UpdateRoomRackData } from "common/front-desk/define-api-roomRack";
import { ResRoom } from "common/define-api-booking";
import { useDispatch } from "react-redux";
import { deleteTaskFromRoom, changeTaskToRoom, updateTaskFromRoom, updateRoomRackFooter } from "redux/controller/frontdesk/roomrack.slice";
import { Modal } from 'antd';
import openNotification from "../CNotification";
import { NotificationStatus } from "common/enum/shared.enum";
import { DataGroup, DataRooms, DefaultDataRooms, Task } from "common/front-desk/define-roomRack";

interface HandleTask {
    dragX: boolean,
    dragY: boolean,
    resizeRight: boolean,
    resizeLeft: boolean,
}
interface DataTask extends Props {
    dataGroup: DataGroup,
    dataRooms: DataRooms,
    widthOfColumns: number,
    dataRow: ResRoom,
    setIdRoomSelect: React.Dispatch<React.SetStateAction<string>>,
    setSelectDataRow: React.Dispatch<React.SetStateAction<DataRooms>>,
    idRoomSelect?: string,
};

export default function TaskResize({ dataGroup, dataRooms, widthOfColumns, itemNextAndPrevious, listPositionOfTask, 
    dataRow, setSelectDataRow, setIdRoomSelect, idRoomSelect, ...props }: DataTask): JSX.Element {
    const color: any = {
        0: {
            class: "reservation",
            name: 'Reservation',
        },
        1: {
            class: "stayOver",
            name: "Stay Over",
        },
        2: {
            class: "checkout",
            name: "Checkout",
        }
    }
    const refRnd = useRef<any>();
    const refDrag = useRef<HTMLLIElement>(null);
    const [overLapping, setOverLapping] = useState("move");
    const { startDate, data, taskOfRoom, guestDataProfile } = useSelectorRoot(state => state.roomRack);
    const [boundingDefault, setBoundingDefault] = useState<DOMRect | null>();
    const dispatch = useDispatch();
    
    const arrivalDate = new Date(dataRooms.arrivalDate);
    const departureDate = new Date(dataRooms.departureDate);
    const [boundingStart, setBoundingStart] = useState<{ width: number, height: number }>({ width: 0, height: 45 });
    const [indexArrival, setIndexArrival] = useState<number>(differenceInCalendarDays(new Date(dataRooms.arrivalDate), startDate))
    const [isOnDrag, setIsOnDrag] = useState(false);
    const [isOnResize, setIsOnResize] = useState(false);
    const [positionTask, setPositionTask] = useState({
        x: (indexArrival + 0.5) * widthOfColumns, y: 0
    });
    const [isVisbile, setIsVisble] = useState(false);
    const [positionOfTitle, setPositionOfTitle] = useState({ top: 10, left: positionTask.x < 0 ? -positionTask.x + 10 : 10 });
    const [positionDefault, setPositionDefault] = React.useState({ x: 0, y: 0 });
    const [positionStart, setPositionStart] = React.useState({ x: 0, y: 0 });
    
    const [bounding, setBounding] = React.useState<{ width: number, height: number }>({
        height: 45,
        width: widthOfColumns * (differenceInCalendarDays(departureDate, arrivalDate)),
    });
    const [handleTask, setHandleTask] = useState<HandleTask>({
        dragX: false,
        dragY: false,
        resizeLeft: false,
        resizeRight: false,
    })
    const getClass = (data: DataRooms) => {
        const { status } = data;
        if(!color[status]) return "" 
        return color[status]
    }

    function onDrag(e: DraggableEvent, data: DraggableData) {
        if (!isOnDrag) {
            setIsOnDrag(true);
        }
        if (data.x < 0) {
            setPositionOfTitle({ left: -data.x + 10, top: 10 })
        }
        let countMove = 0;
        const reactDraggable = document.getElementsByClassName("draggableTask");
        if (boundingDefault) {
            let rect2 = boundingDefault.y;
            rect2 = boundingDefault.y + data.deltaY;
            const newBoundingDefault = {
                ...boundingDefault,
                y: rect2,
                // left: boundingDefault.left + data.deltaX,
                // right: boundingDefault.right + data.deltaX,
            }
            setBoundingDefault(newBoundingDefault);
            for (let i = 0; i < reactDraggable.length; i++) {
                const rect1 = reactDraggable[i].getBoundingClientRect();
                if (!(rect1.right < newBoundingDefault.left ||
                    rect1.left > newBoundingDefault.right ||
                    rect2 !== rect1.y
                )) {
                    setOverLapping("not-allowed");
                }
                else {
                    countMove += 1
                }
            }
            if (countMove === reactDraggable.length) {
                setOverLapping("move");
            }
        }
    }

    //eslint-disable-next-line
    function onResizeStart(e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, dir: any, ref: HTMLElement) {
        if (!isOnResize) {
            setIsOnResize(true);
            setOverLapping("col-resize");
        }
        setPositionTask({ x: positionTask.x, y: positionTask.y });
        setBoundingStart({ width: bounding.width, height: 45 });
        setPositionStart({x : positionTask.x, y : positionTask.y});
    }

    //eslint-disable-next-line
    function onResize(e: MouseEvent | TouchEvent, dir: any, ref: HTMLElement, delta: ResizableDelta, position: Position) {
        const reactDraggable = document.getElementsByClassName("draggableTask");
        if (dir === "left") {
            setBounding({ width: parseInt(ref.style.width, 10), height: 45 })
            if (refRnd) {
                refRnd.current.updatePosition({ x: positionTask.x - delta.width, y: 0 })
            }    
            //checkOverLapping
            for (let i = 0; i < reactDraggable.length; i++) {
                const task = reactDraggable[i].getBoundingClientRect();
                //Check if task is in the same row
                if(ref.getBoundingClientRect().y === task.y){
                    const gridTaskPositionOnLeft = Math.floor(task.right / widthOfColumns);
                    const gridTaskResizingPosition = Math.floor(ref.getBoundingClientRect().x/widthOfColumns);
                    //Overlapping
                    if( gridTaskPositionOnLeft  > gridTaskResizingPosition && 
                        task.left < positionTask.x){
                        setOverLapping("not-allowed")
                    }
                }
            }
        }
        else {
            setBounding({ width: parseInt(ref.style.width, 10), height: 45 })
            for(let i = 0; i< reactDraggable.length; i++){
                const task = reactDraggable[i].getBoundingClientRect();
                //check if tasks are on the same row
                if(ref.getBoundingClientRect().y === task.y){
                    const gridTaskPositionOnLeft = Math.floor(task.left / widthOfColumns);
                    const gridTaskResizingPosition = Math.floor(ref.getBoundingClientRect().right / widthOfColumns);
                    //Overlapping
                    if(gridTaskResizingPosition > gridTaskPositionOnLeft){
                        if(task.x > ref.getBoundingClientRect().x){
                            setOverLapping("not-allowed");
                        }
                    }
                }
            }
        }
    }

    //eslint-disable-next-line
    function onResizeStop(e: MouseEvent | TouchEvent, dir: any, ref: HTMLElement, delta: ResizableDelta, position: Position) {
        const resizeGrid = Math.round(delta.width / widthOfColumns);
        if(overLapping === "not-allowed"){
            refRnd.current.updatePosition({ x: positionTask.x, y: 0 })
            setBounding({width : boundingStart.width, height: 45})
            setOverLapping("move");
            return;
        }
        if (dir === "left") {
            const gridOfBussinessDate = differenceInCalendarDays(new Date(), startDate);
            const newArrivalDate = addDays(new Date(arrivalDate), -resizeGrid);
            const newIndexArrival = differenceInCalendarDays(new Date(newArrivalDate), startDate);
            //Resize task to the past of businessDate
            if(newIndexArrival < gridOfBussinessDate){
                setBounding({ width: boundingStart.width, height: 45 });
                refRnd.current.updatePosition({x : positionTask.x, y : 0});
                setPositionTask({x : positionTask.x, y : 0});
            }
            //Resize task to the day after bussinessDate
            else{
                const newData: UpdateRoomRackData = {
                    id: dataRooms.id,
                    mappingRoomId: dataRooms.mappingRoomId,
                    arrivalDate: Utils.convertMiddleDate(newArrivalDate),
                    departureDate: Utils.convertMiddleDate(departureDate),
                    totalRoom: 10,
                    roomTypeGuid: dataRooms.roomType,
                    roomName: dataRooms.roomName,
                }
                Modal.confirm({
                    title: 'Do you want to update this task?',
                    content: '',
                    className: "custom-modal-confirm-pkm",
                    onOk() {
                        RoomRackService.updateTask(newData).then((res) => {
                            const index = taskOfRoom[dataRooms.mappingRoomId].findIndex((item: Task) => item.dataRooms.id === res.data.id);
                            const newDataUpdateRedux = {
                                dataGroup,
                                dataRooms: res.data,
                            }
                            openNotification(NotificationStatus.Success, "Success", "Change Success!!!");
                            dispatch(updateTaskFromRoom({ data: newDataUpdateRedux, index, mappingRoomId: res.data.mappingRoomId }));
                            setIsOnResize(false);
                            setPositionTask({x: positionTask.x - delta.width, y: 0  });
                            //update task roomrack
                            const gridOfArrivalDate = Math.ceil((positionTask.x) / widthOfColumns);
                            dispatch(updateRoomRackFooter({gridOfDeparture : gridOfArrivalDate - 1, resizeGrid}))
                        }).catch((err) => openNotification(NotificationStatus.Error, "Failed", "Update Failed")
                        )
                    },
                    onCancel() {
                        setBounding({ width: boundingStart.width, height: 45 });
                        setPositionTask({x : positionTask.x, y : 0});
                    }
                });
                setPositionTask({ x: positionTask.x - resizeGrid * widthOfColumns, y: 0 })
            }
        }
        //Resize is right
        else {
            if (resizeGrid === 0) return;
            const newDeperatureDate = addDays(new Date(departureDate), resizeGrid);
            const newData: UpdateRoomRackData = {
                id: dataRooms.id,
                mappingRoomId: dataRooms.mappingRoomId,
                arrivalDate: Utils.convertMiddleDate(arrivalDate),
                departureDate: Utils.convertMiddleDate(newDeperatureDate),
                totalRoom: 10,
                roomTypeGuid: dataRooms.roomType,
                roomName: dataRooms.roomName,
            }
            Modal.confirm({
                title: 'Do you want to update this task?',
                content: '',
                className: "custom-modal-confirm-pkm",
                onOk() {
                    RoomRackService.updateTask(newData).then((res) => {
                        const index = taskOfRoom[dataRooms.mappingRoomId].findIndex((item: Task) => item.dataRooms.id === res.data.id);
                        const newDataUpdateRedux = {
                            dataGroup,
                            dataRooms: res.data,
                        }
                        openNotification(NotificationStatus.Success, "Success", "Change Success!!!");
                        dispatch(updateTaskFromRoom({ data: newDataUpdateRedux, index, mappingRoomId: res.data.mappingRoomId }));
                        setIsOnResize(false);
                        // Change data of RoomRack Footer
                        // indexArrival
                        const gridOfDeparture = Math.ceil((bounding.width + positionTask.x) / widthOfColumns);
                        dispatch(updateRoomRackFooter({gridOfDeparture,resizeGrid}))
                    }).catch((err) => {
                        setBounding({ width: boundingStart.width, height: 45 });
                        openNotification(NotificationStatus.Error, "Failed", "Update Failed")
                        setIsOnResize(false);
                    })
                },
                onCancel() {
                    setBounding({ width: boundingStart.width, height: 45 });
                    setIsOnResize(false);
                }
            });
        }
        setOverLapping("move");
    }

    function onDragStart(e: RndDragEvent, d: DraggableData) {  
        setBoundingDefault(d.node.getBoundingClientRect())
        setPositionDefault({ x: d.lastX, y: d.y });
        setPositionStart({ x: positionTask.x, y: positionTask.y });
    }

    function onDragStop(e: RndDragEvent, d: DraggableData) {
        // //Drag x
        // let dragGridX = Math.round((d.lastX - positionDefault.x) / widthOfColumns); // + - index of deperature
        const deltaDragY = (d.lastY - positionDefault.y); // + - index to find room
        const dragGridY = deltaDragY / 45;
        const indexDataRow = data.findIndex((item) => dataRow === item);
        const dataRowTo = data[indexDataRow + dragGridY];
        // can drag stop and has change data
        // if (!handleTask.dragX) {
        //     dragGridX = 0;
        // }

        // if (overLapping === "move" && (dragGridX !== 0 || dragGridY !== 0)) {
        if(overLapping === "move" && dragGridY !==0){
            const newArrivalDate = addDays(new Date(arrivalDate), 0);
            const newDeperatureDate = addDays(new Date(departureDate), 0);
            const newData: UpdateRoomRackData = {
                id: dataRooms.id,
                mappingRoomId: dataRowTo.guid,
                arrivalDate: Utils.convertMiddleDate(newArrivalDate),
                departureDate: Utils.convertMiddleDate(newDeperatureDate),
                totalRoom: 10,
                roomTypeGuid: dataRowTo.loai,
                roomName: dataRowTo.so,
            }
            const sliceData = taskOfRoom[dataRooms.mappingRoomId].filter((item: Task) => item.dataRooms.id !== dataRooms.id);
            setPositionTask({ x: positionStart.x, y: positionStart.y + deltaDragY })
            Modal.confirm({
                title: 'Do you want to change room?',
                content: '',
                className: "custom-modal-confirm-pkm",
                onOk() {
                    RoomRackService.updateTask(newData).then((res) => {
                        dispatch(deleteTaskFromRoom({ data: sliceData, roomGuid: dataRooms.mappingRoomId }))
                        dispatch(changeTaskToRoom({ data: { dataGroup: dataGroup, dataRooms: res.data }, roomGuid: dataRowTo.guid }))
                        openNotification(NotificationStatus.Success, "Success", "Change Success!!!");
                        setIsOnDrag(false);
                    }).catch((err) => {
                        openNotification(NotificationStatus.Error, "Failed", "Update Failed");
                        setPositionTask({
                            x: positionStart.x, y: positionStart.y
                        });
                    }
                    )
                },
                onCancel() {
                    setPositionTask({
                        x: positionStart.x, y: positionStart.y
                    })
                }
            })
        }
        else {
            setPositionTask({ x: positionStart.x, y: positionStart.y });
        }
        // if (positionTask.x + dragGridX * widthOfColumns < 0) {
        //     setPositionOfTitle({ left: -(positionTask.x + dragGridX * widthOfColumns) + 10, top: 10 })
        // }
        setOverLapping("move");
        setIsOnDrag(false);
    }

    const getDragHandle = (dragX: boolean, dragY: boolean) => {
        if (dragX && dragY) {
            return "both"
        }
        else {
            if (dragX) {
                return "x"
            }
            if (dragY) {
                return "y"
            }
            else {
                return "none"
            }
        }
    }

    React.useEffect(() => {
        const handleTask: HandleTask = {
            dragX: false,
            dragY: false,
            resizeLeft: false,
            resizeRight: false,
        }
        const diffDay = differenceInCalendarDays(departureDate, new Date()) + 1;
        //If task it in the past, It can be drag or resize
        if (diffDay < 0) return
        else {
            //If task status is StayOver
            if (dataRooms.status === 1) {
                const cloneHandleTask = { ...handleTask, dragY: true, resizeRight: true, ResizeLeft: false };
                setHandleTask(cloneHandleTask);
            }
            //If task status is Reservation
            if (dataRooms.status === 0) {
                if (differenceInCalendarDays(arrivalDate, new Date()) < 0) {
                    const cloneHandleTask = { ...handleTask, dragX: false, dragY: true, resizeX: true, resizeLeft: false, resizeRight: true };
                    setHandleTask(cloneHandleTask);
                }
                else {
                    const cloneHandleTask = { ...handleTask, dragX: false, dragY: true, resizeX: true, resizeLeft: true, resizeRight: true };
                    setHandleTask(cloneHandleTask);
                }
                
            };
        }
        //eslint-disable-next-line
    }, [])
    
    React.useEffect(() => {
        setIndexArrival(differenceInCalendarDays(new Date(dataRooms.arrivalDate), startDate));
        const indexArrival = differenceInCalendarDays(new Date(dataRooms.arrivalDate), startDate);
        setPositionTask({
            x: (indexArrival + 0.5) * widthOfColumns,
            y: 0
        })
        //eslint-disable-next-line
    }, [startDate]);

    React.useEffect(() => {
        setPositionOfTitle({ top: 10, left: positionTask.x < 0 ? -positionTask.x + 10 : 10 })
    }, [positionTask.x])

    React.useEffect(() => {
        if(isOnDrag || isOnResize){
            setIsVisble(false);
        }
    },[isOnDrag,isOnResize]);

    //Update Position Task and Size when window is resized
    React.useEffect(() => {
        setPositionTask({
            x: (indexArrival + 0.5) * widthOfColumns,
            y: 0
        })
        setBounding({
            height: 45,
            width: widthOfColumns * (differenceInCalendarDays(departureDate, arrivalDate)),
        })
        //eslint-disable-next-line
    },[widthOfColumns]);

    const handleClickRooms = (dataRooms: DataRooms, e: React.MouseEvent<HTMLLIElement, MouseEvent> ) => {
        e.stopPropagation()
        if(dataRooms.id !== idRoomSelect){
            setIdRoomSelect(dataRooms.id)
            setSelectDataRow(dataRooms)
        }else{
            setIdRoomSelect("")
            setSelectDataRow(DefaultDataRooms)
        }
    }
    
    return (
        <Popover
            overlayInnerStyle={{ width: 380, height: 220 }}
            content={
                <>
                    <div style={{ width: '380px !important', borderBottom: '1px dashed #E7E7E7' }}>
                        <span className="font-bold text-base">
                            {
                                //eslint-disable-next-line
                                dataRooms.transactRoom.map((item) => {
                                    if (!item.parentMeGuid) {
                                        return guestDataProfile[item.guestId]?.firstName
                                    }
                                })
                            }
                        </span>
                        <div className="flex justify-between py-1">
                            <div>Date: <span className="font-bold">{ }</span></div>
                            <div>Rate: <span className="font-bold">{ }</span></div>
                        </div>
                        <div className="flex justify-between py-1">
                            <div>Specials: <span className="font-bold"></span></div>
                            <div>MasterId: <span className="font-bold">0</span> </div>
                        </div>
                    </div>
                    <div>
                        <span className="font-bold text-base">Group Info:</span>
                        <span className="text-xs px-2" style={{ color: '#66666 !important' }}>{`<${dataGroup.reservCode}>`}</span>
                        <div className="flex justify-between py-1">
                            <div>Total Rooms: <span className="font-bold">{dataGroup.totalRoom}</span></div>
                            <div>Total Rev: <span className="font-bold">{Utils.formatNumber(dataGroup.totalRevenue)}</span></div>
                        </div>
                        <div className="flex justify-between py-1">
                            <div>Total Guest: <span className="font-bold">{dataGroup.totalGuest}</span></div>
                            <div>Fix Charge: <span className="font-bold">{dataGroup.totalFixCharge}</span></div>
                        </div>
                        <div className="flex justify-between py-1">
                            <div>Deposit: <span className="font-bold">{dataGroup.deposit}</span></div>
                            <div>Rooms Rev: <span className="font-bold">{dataGroup.totalRevenue}</span></div>
                        </div>
                    </div>
                </>
            }
            // title={"Name"}
            trigger="hover"
            visible={isVisbile}
            placement={'topRight'}
            onVisibleChange={() => {
                setIsVisble(!isVisbile)
            }}
        >
            <Rnd
                ref={(c) => { refRnd.current = c; }}
                size={{ width: bounding.width, height: bounding.height }}
                className={isOnDrag || isOnResize ? "dragging" : "draggableTask"}
                dragAxis={getDragHandle(handleTask.dragX, handleTask.dragY)}
                disableDragging={!handleTask.dragX && !handleTask.dragY}
                dragGrid={[widthOfColumns, 45]}
                resizeGrid={[widthOfColumns, 1]}
                onResizeStart={onResizeStart}
                onResize={onResize}
                onResizeStop={onResizeStop}
                position={{ x: positionTask.x, y: positionTask.y }}
                onDragStop={onDragStop}
                enableResizing={{
                    bottom: false,
                    bottomLeft: false,
                    bottomRight: false,
                    left: handleTask.resizeLeft,
                    right: handleTask.resizeRight,
                    top: false,
                    topLeft: false,
                    topRight: false
                }}
                style={{
                    zIndex: isOnDrag || isOnResize ? 999 : 99,
                }}
                onDragStart={onDragStart}
                onDrag={onDrag}
            >
                <li className={`chart-li-one ${getClass(dataRooms).class} relative`}
                    ref={refDrag}   
                    style={idRoomSelect === dataRooms.id ? {
                        cursor: overLapping,
                        opacity: isOnDrag ? 0.5 : 1,
                        height: bounding.height,
                        width: bounding.width,
                        border: "2px solid"
                    } :
                        {
                            cursor: overLapping,
                            opacity: isOnDrag ? 0.5 : 1,
                            height: bounding.height,
                            width: bounding.width,
                        }
                    }
                    onClick={(e) => handleClickRooms(dataRooms, e)}
                >
                    <span className="absolute" style={{ top: positionOfTitle.top, left: positionOfTitle.left }}>
                        {
                            //eslint-disable-next-line
                            dataRooms.transactRoom.map((item) => {
                                if (!item.parentMeGuid) {
                                    return `${guestDataProfile[item.guestId]?.firstName ?? ""} ${guestDataProfile[item.guestId]?.guestName ?? ""} `
                                }
                            })
                        }
                    </span>
                </li>
            </Rnd>
        </Popover >
    )
}