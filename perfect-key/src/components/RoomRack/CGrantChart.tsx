/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useStyleTheme } from 'theme';
import CIconSvg from "../CIconSvg";
import TaskResizable from "./TaskResizable";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { ResRoom } from "common/define-api-booking";
import { ScrollSyncPane } from "react-scroll-sync";
import CLoading from "../CLoading";
import { setCurrentPage } from "redux/controller/frontdesk/roomrack.slice";
import { stylesGrantChart } from "./style/grantChartStyle";
import { DataRooms, DefaultDataRooms } from "common/front-desk/define-roomRack";

interface ChartProps extends Props {
    listDate: string[],
    widthOfColumns : number,
    setWidthOfColumns : any,
    handleOnScrollTotal: any,
    setSelectDataRow: React.Dispatch<React.SetStateAction<DataRooms>>
    selectDataRow: DataRooms
}

const CGrantChart = ({ listDate, handleOnScrollTotal,widthOfColumns,setWidthOfColumns, setSelectDataRow, selectDataRow, ...props }: ChartProps) => {
    const refContainer = useRef<HTMLDivElement>(null);
    const classes = useStyleTheme(stylesGrantChart);
    const roomNameColumns = useRef<HTMLDivElement>(null);

    const { loading, totalPages,currentPage } = useSelectorRoot(state => state.roomRack);
    const { data } = useSelectorRoot(state => state.roomRack);
    const { taskOfRoom } = useSelectorRoot(state => state.roomRack);
    const dispatch = useDispatchRoot();

    const [columns, setColumns] = useState(listDate.length);

    const handleOnScroll = () => {
        //event scroll down to bottom
        if (roomNameColumns && roomNameColumns.current) {
            const scrollHeight = roomNameColumns.current.scrollHeight;
            const scrollY = roomNameColumns.current.scrollTop;
            const clientHeight = roomNameColumns.current.clientHeight;
            if (scrollHeight - scrollY === clientHeight && currentPage !== totalPages) {
                // setCurrentPage(currentPage + 1);
                dispatch(setCurrentPage(currentPage + 1));
            }
        }
    }

    useEffect(() => {
        setColumns(listDate.length);
        setWidthOfColumns((window.innerWidth - 60) * 80 / 100 / (listDate.length <= 7 ? listDate.length : 7))
        //eslint-disable-next-line
    }, [listDate.length])

    function renderRow() {
        if (!taskOfRoom) {
            return <CLoading visible={true} />
        }
        return data.map((item: ResRoom, index: number) => {
            return <TaskResizable
                task={taskOfRoom[item.guid]}
                data={item}
                key={index}
                widthOfColumns={widthOfColumns}
                item={item.guid}
                columns={columns}
                setSelectDataRow={setSelectDataRow}
                selectDataRow={selectDataRow}
            />
        })
    }

    function renderRoom() {
        return data.map((item, index: number) => {
            return (
                <div key={index} className="roomRow">
                    <span>
                        {item.so}
                    </span>
                    
                    <CIconSvg 
                        name='user-check' 
                        // name = {taskOfRoom[item.guid]  && taskOfRoom[item.guid] > 0 ? "user-check" : InfoRoomPlan.Home}
                        // hexColor='#4caf50'  
                        hexColor = {item.cleanDirty === 1 ? `#4caf50` : `#F74352`}
                    />
                </div >
            )
        })
    }

    function handleOnScrollLeft() {
        if (refContainer.current) {
            handleOnScrollTotal(refContainer.current.scrollLeft);
        }
    }

    const handleClickOutsideRoom = () => {
        setSelectDataRow(DefaultDataRooms)
    }

    return (
        <CLoading visible={loading}>
            <div style={{ display: 'flex' }}
                ref={refContainer}
                className={classes.container}
                onScroll={handleOnScrollLeft}
            >
                <div
                    className={'roomName'}
                    style={{
                        height: "100%",
                        width: (window.innerWidth - 60) * 20 / 100,
                    }}
                >
                    <div className="roomStatus-period p-2">
                        <span>Room</span>
                        <span>Status</span>
                    </div>
                    <ScrollSyncPane>
                        <div className="roomName__columns"
                            ref={roomNameColumns}
                            style={{ height: 'calc(100% - 60px)', overflow: 'auto' }}
                            onScroll={handleOnScroll}
                        >
                            {renderRoom()}
                        </div>
                    </ScrollSyncPane>

                </div>

                <div
                    className={'task'}
                    style={{
                        position: "relative",
                        width: (window.innerWidth - 60) * 80 / 100,
                    }}>

                    <div
                        className="chart-period"
                        style={{
                            gridTemplateColumns: `repeat(${columns},${widthOfColumns}px)`,
                        }}
                    >
                        {
                            listDate.map((item: string,index) => {
                                const dateOfWeek = item.split(' ');
                                return (
                                    <span className="pb-2" key={index} style={item.includes("Sun") ? { color: '#F74352' } : { color: '#00293B' }}>
                                        <div>{dateOfWeek[0]}</div>
                                        <div className={'font-medium'}>{dateOfWeek[1]}</div>

                                    </span>
                                )
                            })
                        }
                    </div>
                    <div
                        className="chart-lines"
                        style={{
                            gridTemplateColumns: `repeat(${columns},${widthOfColumns}px)`,
                        }}>
                        {
                            listDate.map((item: string, index: number) => {
                                return (
                                    <span key={index} >
                                    </span>
                                )
                            })
                        }
                    </div>
                    <ScrollSyncPane>
                        <div
                            className={"rowTasks"}
                            onClick={() => handleClickOutsideRoom()}
                            style={{
                                position: "relative",
                                height: "calc(100% - 60px)",
                                overflowX: "hidden",
                                width: isFinite(widthOfColumns) ? widthOfColumns * columns : 0,
                            }}>
                            {widthOfColumns ? renderRow() : ""}
                        </div>
                    </ScrollSyncPane>
                </div>
            </div >
        </CLoading>
    )
}

export default React.memo(CGrantChart);
