import { TimeOffLimit } from "../models/timeOffLimit";

export default interface ITimeOffLimit {
    insert(data: TimeOffLimit): Promise<TimeOffLimit>;
    findAll(): Promise<TimeOffLimit[]>;
    updateByGuid(guid: string, data: TimeOffLimit): Promise<boolean>;
    deleteById(guid: string): Promise<boolean>;
}
