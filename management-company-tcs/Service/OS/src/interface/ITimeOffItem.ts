import { TimeOffItem } from "../models/timeOffItem";

export default interface ITimeOffItem {
	insert(data: TimeOffItem): Promise<TimeOffItem>;
	findAll(): Promise<TimeOffItem[]>;
	updateByGuid(guid: string, data: TimeOffItem): Promise<boolean>;
	deleteById(guid: string): Promise<boolean>;
}
