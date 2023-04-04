import React from "react";
import { ResRoom } from "common/define-api-booking";
import TaskResize from "./TaskResize";
import { useSelectorRoot } from "redux/store";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { DataGroup, DataRooms, Task } from "common/front-desk/define-roomRack";

export interface DataChart extends Props {
    id: number,
    taskChildren: TaskChildren[]
}

export interface PropsGantt extends Props {
    data: ResRoom,
    widthOfColumns: number,
    task: { dataGroup: DataGroup, dataRooms: DataRooms}[],
    columns: number,
    setSelectDataRow: React.Dispatch<React.SetStateAction<DataRooms>>,
    selectDataRow: DataRooms
}
export interface TaskChildren {
    type: string,
    startDate: number,
    duration: number,
    name: string,
}

export default function TaskResizable({ data, widthOfColumns, task, columns, setSelectDataRow, selectDataRow, ...props }: PropsGantt): JSX.Element {
    const { startDate } = useSelectorRoot(state => state.roomRack);
    const [idRoomSelect, setIdRoomSelect] = React.useState("");
    const positionOfTaskRow: { start: number, end: number }[] = [];
    if (task && task.length > 0) {
        task.forEach((item: Task, index: number) => {
            const indexArrival = differenceInCalendarDays(new Date(item.dataRooms.arrivalDate), startDate);
            const indexDeperature = differenceInCalendarDays(new Date(item.dataRooms.departureDate), startDate);
            positionOfTaskRow.push({ start: (indexArrival + 0.5) * widthOfColumns, end: (indexDeperature + 0.5) * widthOfColumns });
        });
    }

    const renderTask = (task: Task[]) => {
        if (task) {
            const statusToShowOnChart = [0,1,2];
            let isCheckSelectRow = false
            if (task.length < 0) return <div></div>;
            return task.map((item: { dataGroup: DataGroup, dataRooms: DataRooms }, index: number) => {
                // eslint-disable-next-line array-callback-return
                if(!statusToShowOnChart.includes(item.dataRooms.status)) return;
                if(item.dataRooms.id === selectDataRow.id) {
                    isCheckSelectRow = true
                }
                return <TaskResize
                    dataGroup={item.dataGroup}
                    dataRooms={item.dataRooms}
                    dataRow={data}
                    key={item.dataRooms.id}
                    widthOfColumns={widthOfColumns ? widthOfColumns : 0}
                    setIdRoomSelect={setIdRoomSelect}
                    setSelectDataRow={setSelectDataRow}
                    idRoomSelect={isCheckSelectRow ? idRoomSelect : ""}
                />
            })
        }
    }
    return (
        <div style={{ width: widthOfColumns * columns * 2 }} >
            <ul className="chart-row-bars"
                style={{
                    position: "relative",
                    borderBottom: '1px solid #E3E4E5',
                    height: 45,
                    listStyle: 'none',
                    display: 'grid',
                    margin: 0,
                    gridGap: '10px 0',
                }}
            >
                {renderTask(task)}
            </ul>
        </div >
    )
}