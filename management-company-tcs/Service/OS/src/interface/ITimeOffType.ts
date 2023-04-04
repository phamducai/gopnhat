import { TimeOffType } from "../models/timeOffType";

export default interface ITimeOffType {
    insert(data: TimeOffType): Promise<TimeOffType>;
    findAll(): Promise<TimeOffType[]>;
    updateByGuid(guid: string, data: TimeOffType): Promise<boolean>;
    deleteById(guid: string): Promise<boolean>;
}
